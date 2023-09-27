MATCH (p:Permission {slug: $permission}), (r:Resource {uuid: $resource})
CREATE (r)-[rel:HAVE_OPTION]->(p)
RETURN rel