"use client";

import { useFormState } from "react-dom";
import { applyToCourseAction, type EnrollmentActionState } from "@/features/enrollments/actions";
import { SubmitButton } from "@/components/shared/submit-button";

const initialState: EnrollmentActionState = {};

export function ApplyButton({
  locale,
  courseId,
}: {
  locale: string;
  courseId: string;
}) {
  const [state, formAction] = useFormState(applyToCourseAction, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="courseId" value={courseId} />
      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-primary">{state.success}</p> : null}
      <SubmitButton variant="hero" size="lg" pendingLabel="Submitting request...">
        Apply for access
      </SubmitButton>
    </form>
  );
}
