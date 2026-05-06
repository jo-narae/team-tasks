import type { Member } from "@/types";

interface Props {
  member: Member;
  size?: "sm" | "md";
}

export function MemberAvatar({ member, size = "sm" }: Props) {
  const dim = size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0 ${dim}`}
      style={{ backgroundColor: member.color }}
      title={member.name}
    >
      {member.name.slice(0, 1)}
    </span>
  );
}
