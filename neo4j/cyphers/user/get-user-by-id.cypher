MATCH (u:User {id: $id}) RETURN u

MATCH (p:User { id: $id })
SET p.birthdate = date('1980-01-01')
RETURN p