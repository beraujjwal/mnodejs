CREATE (u:User {
    uuid: $_id,
    name: $name,
    phone: $phone,
    email: $email,
    isEmailVerified: $isEmailVerified,
    isPhoneVerified: $isPhoneVerified,
    status: $status,
    verified: $verified,
    blockExpires: $blockExpires,
    createdAt: $createdAt
})

WITH u, $roles AS roles

MATCH (r:Role)
WHERE r.slug in roles
CREATE (u)-[rel1:BELONGS_TO_ROLE]->(r) SET rel1.assignedOn = $createdAt
CREATE (r)-[rel2:ROLE_HAS_USER]->(u) SET rel2.from = $createdAt

RETURN u