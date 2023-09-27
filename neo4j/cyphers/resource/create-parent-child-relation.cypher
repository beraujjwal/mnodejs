MATCH (ch:Resource {uuid: $child}), (pr:Resource {uuid: $parent})
CREATE (ch)-[rel1:PARENT]->(pr) SET rel1.assignedOn = $date
CREATE (pr)-[rel2:CHILD]->(ch) SET rel2.assignedOn = $date