import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DB } from "@/app/sanity-checks/useDatabase2/page";

export default function EditName(
  props: DB["patients"] & {
    mutate: (form: { id: string; newName: string }) => void;
    isMutationPending: boolean;
  },
) {
  const [fullName, setFullName] = useState(props.full_name);

  return (
    <div className="flex gap-2 my-2">
      Full name:
      <Input
        className="max-w-xs"
        value={fullName ?? undefined}
        onChange={(e) => setFullName(e.currentTarget.value)}
      />
      <Button
        onClick={() => {
          if (fullName) {
            props.mutate({
              id: props.id,
              newName: fullName,
            });
          }
        }}
        disabled={props.isMutationPending}
      >
        Save
      </Button>
    </div>
  );
}
