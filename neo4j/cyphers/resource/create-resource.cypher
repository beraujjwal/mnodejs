CREATE r = (:Resource {
    uuid: $_id,
    name: $name,
    slug: $slug,
    status: $status,
    deleted: $deleted,
    createdAt: $createdAt,
    updatedAt: $updatedAt
})
RETURN r