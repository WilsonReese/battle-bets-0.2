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
      <Txt style={{ fontSize: 20, color: "#F8F8F8", fontFamily: 'Saira_600SemiBold', marginBottom: 8,}}>Members</Txt>
      <PaginatedFlatList
        data={memberships}
        itemsPerPage={8}
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
