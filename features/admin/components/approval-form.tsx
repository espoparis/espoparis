import { updateProfileApprovalAction, updateProfileRoleAction } from "@/features/admin/actions";
import { Button } from "@/components/ui/button";

type Props = {
  locale: string;
  profileId: string;
  approvalStatus: "pending" | "approved" | "rejected";
  role: "admin" | "teacher" | "student";
};

export function ApprovalForm({ locale, profileId, approvalStatus, role }: Props) {
  return (
    <div className="surface-subtle flex flex-wrap gap-2 rounded-[1.5rem] p-4">
      <form action={updateProfileApprovalAction}>
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="profileId" value={profileId} />
        <input type="hidden" name="approvalStatus" value="approved" />
        <Button
          type="submit"
          size="sm"
          variant={approvalStatus === "approved" ? "secondary" : "hero"}
        >
          Approve
        </Button>
      </form>
      <form action={updateProfileApprovalAction}>
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="profileId" value={profileId} />
        <input type="hidden" name="approvalStatus" value="rejected" />
        <Button type="submit" size="sm" variant="outline">
          Reject
        </Button>
      </form>
      {role !== "teacher" ? (
        <form action={updateProfileRoleAction}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="profileId" value={profileId} />
          <input type="hidden" name="role" value="teacher" />
          <Button type="submit" size="sm" variant="secondary">
            Promote to teacher
          </Button>
        </form>
      ) : null}
      {role !== "student" ? (
        <form action={updateProfileRoleAction}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="profileId" value={profileId} />
          <input type="hidden" name="role" value="student" />
          <Button type="submit" size="sm" variant="secondary">
            Set as student
          </Button>
        </form>
      ) : null}
    </div>
  );
}
