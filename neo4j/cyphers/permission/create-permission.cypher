CREATE (p:Permission {
    uuid: $_id,
    name: $name,
    slug: $slug,
    status: $status,
    deleted: $deleted,
    createdAt: $createdAt,
    updatedAt: $updatedAt
})
RETURN p