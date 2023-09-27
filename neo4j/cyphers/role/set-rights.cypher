MATCH (re:Resource {slug: $resource}), (ro:Role {uuid: $role})
CREATE (ro)-[rel:HAVE_ACCESS]->(re) SET rel.havePermission = $right
RETURN rel