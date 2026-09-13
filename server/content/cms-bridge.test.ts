import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
function bridge() {
  const context=vm.createContext({});
  vm.runInContext(readFileSync(new URL("../../integrations/google-apps-script/cms.gs",import.meta.url),"utf8"),context);
  return context;
}
test("CMS bridge hides expired, draft and archived activities and unapproved sayings",()=>{
  const c=bridge();
  c.readCmsItems_=()=>[
    {id:"live",status:"published"}, {id:"draft",status:"draft"}, {id:"hidden",status:"archived"},
    {id:"ended",status:"published",schedule:{unpublishAt:"2020-01-01T00:00:00Z"}},
    {id:"future",status:"published",schedule:{publishAt:"2099-01-01T00:00:00Z"}},
  ];
  c.readCmsReflections_=()=>[{id:"approved",approved:true},{id:"pending",approved:false}];
  c.readCmsProfiles_=()=>[{id:"approved",approved:true},{id:"draft",approved:false}];
  const result=JSON.parse(JSON.stringify(c.cmsPublicSnapshot_({at:"2026-09-12T12:00:00Z"})));
  assert.deepEqual(result.items.map((x:{id:string})=>x.id),["live"]);
  assert.deepEqual(result.reflections.map((x:{id:string})=>x.id),["approved"]);
  assert.deepEqual(result.profiles.map((x:{id:string})=>x.id),["approved"]);
});
test("public image reads cannot reveal unreferenced or hidden Drive files",()=>{
  const c=bridge();c.cmsPublicSnapshot_=()=>({items:[],profiles:[]});
  assert.throws(()=>c.readCmsImage_("abcdefghijk123",{}),/not published/);
  assert.throws(()=>c.readCmsImage_("abcdefghijk123",{email:"staff@example.com",role:"teacher"}),/denied/);
});
test("editor cannot overwrite an already approved profile or daily text",()=>{
  const c=bridge();const actor={email:"editor@example.com",role:"editor"};
  c.readCmsProfiles_=()=>[{id:"faculty-one",locale:"ar",approved:true}];
  assert.throws(()=>c.saveCmsProfile_({id:"faculty-one",locale:"ar",name:"Name",bio:"Bio",role:"Teacher",approved:false},actor),/denied/);
  c.readCmsReflections_=()=>[{id:"quote",approved:true}];
  assert.throws(()=>c.saveCmsReflection_({id:"quote",kind:"wisdom",arabicText:"نص",sourceLabel:"مصدر",approved:false},actor),/denied/);
});
test("editor cannot overwrite already published content through save",()=>{
  const c=bridge();c.readCmsItems_=()=>[{id:"post",status:"published"}];
  assert.throws(()=>c.saveCmsItem_({id:"post",title:"Title",slug:"title",kind:"activity",status:"draft"},{email:"editor@example.com",role:"editor"}),/denied/);
});
test("image upload rejects mismatched bytes before accessing Drive",()=>{
  const c=bridge();c.Utilities={base64Decode:()=>[60,115,118,103,62]};
  assert.throws(()=>c.uploadCmsImage_({base64:"PHN2Zz4=",mime:"image/jpeg"},{email:"a@example.com",role:"admin"}),/Invalid image/);
});
