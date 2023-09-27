CREATE (r:Role {
    uuid: $_id,
    name: $name,
    slug: $slug,
    status: $status,
    deleted: $deleted,
    createdAt: $createdAt,
    updatedAt: $updatedAt
})


WITH r
MATCH (pr:Role { uuid: $parent})
    CREATE (r)-[:CHILD_OF]->(rp) 
    CREATE (rp)-[:PARENT_OF]->(r) 
RETURN r