/* SQL query for constants values

(select 1 as itemNo, 'GOAL_SUM', count(*) from tblgoal
union
select 2 as itemNo, 'PDP_SUM', count(*) from tblpdp
union
select 3 as itemNo, 'PDPUSER_SUM', count(*) from tblpdpuser
union
select 4 as itemNo, 'SECTION_SUM', count(*) from tblsection
union
select 5 as itemNo, 'USER_SUM', count(*) from tbluser)
order by itemNo;

*/

// Update constants here
export const GOAL_SUM = 1011645;
export const PDP_SUM = 195580;
export const PDPUSER_SUM = 240942;
export const SECTION_SUM = 586740;
export const USER_SUM = 121709;