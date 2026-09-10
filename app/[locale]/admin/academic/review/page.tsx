import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GradeReviewCenter, type GradeReviewCopy } from '@/features/admin/components/grade-review-center';
import { getAuthSession } from '@/server/auth/session';

export default async function Page(props:{params: Promise<{locale:string}>}) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({locale:params.locale,namespace:'gradeReview'});
  const session = await getAuthSession();
  return <GradeReviewCenter copy={t.raw('copy') as GradeReviewCopy} session={session}/>;
}
