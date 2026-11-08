# Banco de Dados B7Store

Sistema de e-commerce com MySQL (MariaDB) via Prisma ORM.

---

## Entidades e Relacionamentos

### User (Usuário)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (UUID) | PK |
| email | String | Único |
| name | String? | Nome do usuário |
| password | String | Hash bcrypt |
| token | String? | Token de autenticação |

```mermaid
erDiagram
  User ||--o{ Order : "1:N"
  User ||--o{ UserAddress : "1:N"
```

### UserAddress (Endereço do Usuário)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (UUID) | PK |
| userId | String | FK → User.id |
| zipCode | String | CEP |
| street | String | Logradouro |
| number | String | Número |
| city | String | Cidade |
| state | String | Estado |
| country | String | País |
| complement | String? | Complemento |

```mermaid
erDiagram
  UserAddress }o--|| User : "N:1"
```

### Banner
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (UUID) | PK |
| img | String | Nome do arquivo da imagem |
| link | String? | URL de destino ao clicar |

Tabela independente, sem relacionamentos.

### Category (Categoria)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (UUID) | PK |
| slug | String | Único, usado em URLs |
| name | String | Nome da categoria |

```mermaid
erDiagram
  Category ||--o{ Product : "1:N"
  Category ||--o{ CategoryMetadata : "1:N"
```

### CategoryMetadata (Metadado da Categoria)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (UUID) | PK |
| categoryId | String | FK → Category.id |
| name | String | Nome do atributo (ex: "Marca", "Cor") |

```mermaid
erDiagram
  CategoryMetadata }o--|| Category : "N:1"
  CategoryMetadata ||--o{ MetadataValue : "1:N"
```

### MetadataValue (Valor do Metadado)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (UUID) | PK |
| categoryMetadataId | String | FK → CategoryMetadata.id |
| value | String | Valor do atributo (ex: "Apple", "Preto") |

```mermaid
erDiagram
  MetadataValue }o--|| CategoryMetadata : "N:1"
```

### Product (Produto)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (UUID) | PK |
| label | String | Nome do produto |
| price | Float | Preço |
| description | String? | Descrição |
| categoryId | String | FK → Category.id |
| viewsCount | Int | Contagem de visualizações |
| salesCount | Int | Quantidade vendida |

```mermaid
erDiagram
  Product }o--|| Category : "N:1"
  Product ||--o{ ProductImage : "1:N"
  Product ||--o{ ProductMetadata : "1:N"
  Product ||--o{ OrderProduct : "1:N"
```

### ProductImage (Imagem do Produto)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (UUID) | PK |
| productId | String | FK → Product.id |
| url | String | Nome do arquivo da imagem |

```mermaid
erDiagram
  ProductImage }o--|| Product : "N:1"
```

### ProductMetadata (Metadado do Produto)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (UUID) | PK |
| productId | String | FK → Product.id |
| categoryMetadataId | String | FK → CategoryMetadata.id |
| metadataValueId | String | FK → MetadataValue.id |

Relaciona um produto a um valor de metadado específico da sua categoria.

```mermaid
erDiagram
  ProductMetadata }o--|| Product : "N:1"
```

### Order (Pedido)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (UUID) | PK |
| userId | String | FK → User.id |
| status | String | pending / paid / cancelled / shipped / delivered |
| total | Float | Valor total do pedido |
| shippingCost | Float | Frete |
| shippingDays | Int | Prazo de entrega |
| shippingStreet/Number/City/... | String? | Endereço de entrega |

```mermaid
erDiagram
  Order }o--|| User : "N:1"
  Order ||--o{ OrderProduct : "1:N"
```

### OrderProduct (Item do Pedido)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (UUID) | PK |
| orderId | String | FK → Order.id |
| productId | String | FK → Product.id |
| quantity | Int | Quantidade |
| price | Float | Preço unitário no momento da compra |

Tabela pivô entre Order e Product (N:N).

```mermaid
erDiagram
  OrderProduct }o--|| Order : "N:1"
  OrderProduct }o--|| Product : "N:1"
```

---

## Diagrama Completo

```mermaid
erDiagram
  Banner {
    string id PK
    string img
    string link
  }

  User {
    string id PK
    string email UK
    string name
    string password
    string token
  }

  UserAddress {
    string id PK
    string userId FK
    string zipCode
    string street
    string number
    string city
    string state
    string country
    string complement
  }

  Category {
    string id PK
    string slug UK
    string name
  }

  CategoryMetadata {
    string id PK
    string categoryId FK
    string name
  }

  MetadataValue {
    string id PK
    string categoryMetadataId FK
    string value
  }

  Product {
    string id PK
    string label
    float price
    string description
    string categoryId FK
    int viewsCount
    int salesCount
  }

  ProductImage {
    string id PK
    string productId FK
    string url
  }

  ProductMetadata {
    string id PK
    string productId FK
    string categoryMetadataId FK
    string metadataValueId FK
  }

  Order {
    string id PK
    string userId FK
    string status
    float total
    float shippingCost
    int shippingDays
  }

  OrderProduct {
    string id PK
    string orderId FK
    string productId FK
    int quantity
    float price
  }

  User ||--o{ UserAddress : ""
  User ||--o{ Order : ""
  Category ||--o{ Product : ""
  Category ||--o{ CategoryMetadata : ""
  CategoryMetadata ||--o{ MetadataValue : ""
  CategoryMetadata ||--o{ ProductMetadata : ""
  Product ||--o{ ProductImage : ""
  Product ||--o{ ProductMetadata : ""
  Product ||--o{ OrderProduct : ""
  Order ||--o{ OrderProduct : ""
```

---

## Resumo dos Relacionamentos

| Tipo | Entidade A | Entidade B | Cardinalidade |
|------|-----------|-----------|---------------|
| 1:N | User | Order | Um usuário → vários pedidos |
| 1:N | User | UserAddress | Um usuário → vários endereços |
| 1:N | Category | Product | Uma categoria → vários produtos |
| 1:N | Category | CategoryMetadata | Uma categoria → vários metadados |
| 1:N | CategoryMetadata | MetadataValue | Um metadado → vários valores |
| 1:N | Product | ProductImage | Um produto → várias imagens |
| 1:N | Product | ProductMetadata | Um produto → vários metadados |
| 1:N | Order | OrderProduct | Um pedido → vários itens |
| N:1 | OrderProduct | Product | Vários itens → um produto |
| N:N | Order ↔ Product | via OrderProduct | Muitos-para-muitos |
