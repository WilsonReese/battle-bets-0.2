// import { PaginatedFlatList } from "../general/PaginatedFlatList";
import { MembershipRow } from "./MembershipRow";
import { Txt } from "../../general/Txt";
import { PaginatedFlatList } from "../../general/PaginatedFlatList";

export function MembershipsTable({
  memberships,
  poolId,
  containerWidth,
  fetchPoolMemberships,
  isCurrentUserCommissioner,
}) {
  return (
    <>
      <Txt style={{ fontSize: 24, color: "#F8F8F8" }}>League Members</Txt>
      <PaginatedFlatList
        data={memberships}
        itemsPerPage={12}
        containerWidth={containerWidth}
        renderItemRow={(member, index, total) => (
          <MembershipRow
            key={member.id}
            member={member}
            isLast={index === total - 1}
            poolId={poolId}
            fetchPoolMemberships={fetchPoolMemberships}
            isCurrentUserCommissioner={isCurrentUserCommissioner}
          />
        )}
      />
    </>
  );
}
