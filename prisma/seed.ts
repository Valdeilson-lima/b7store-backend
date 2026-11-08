import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

const categoryDefs = [
  {
    name: "Eletrônicos", slug: "eletronicos",
    metadata: [
      { name: "Marca", values: ["Apple", "Samsung", "Xiaomi", "Dell", "LG"] },
      { name: "Cor", values: ["Preto", "Branco", "Prata", "Azul"] },
      { name: "Garantia", values: ["3 meses", "6 meses", "1 ano"] },
    ],
  },
  {
    name: "Roupas", slug: "roupas",
    metadata: [
      { name: "Tamanho", values: ["PP", "P", "M", "G", "GG"] },
      { name: "Cor", values: ["Preto", "Branco", "Vermelho", "Azul", "Verde"] },
      { name: "Material", values: ["Algodão", "Poliéster", "Linho", "Jeans"] },
    ],
  },
  {
    name: "Casa e Decoração", slug: "casa-decoracao",
    metadata: [
      { name: "Material", values: ["Madeira", "Vidro", "Aço", "Tecido"] },
      { name: "Cor", values: ["Preto", "Branco", "Marrom", "Bege"] },
    ],
  },
  {
    name: "Esportes", slug: "esportes",
    metadata: [
      { name: "Marca", values: ["Nike", "Adidas", "Olympikus", "Mormaii"] },
      { name: "Tamanho", values: ["P", "M", "G", "GG"] },
      { name: "Indicado para", values: ["Masculino", "Feminino", "Unissex"] },
    ],
  },
  {
    name: "Livros", slug: "livros",
    metadata: [
      { name: "Editora", values: ["Intrínseca", "Companhia das Letras", "Rocco", "Sextante"] },
      { name: "Gênero", values: ["Ficção", "Não ficção", "Autoajuda", "Estratégia"] },
      { name: "Formato", values: ["Físico", "Digital"] },
    ],
  },
];

const products = [
  {
    label: "Smartphone X Pro",
    price: 4999.99,
    description: "Smartphone topo de linha com 256GB, câmera de 108MP e bateria de longa duração.",
    categorySlug: "eletronicos",
    images: ["celular1.svg", "celular2.svg"],
    metadatas: { "Marca": "Apple", "Cor": "Preto", "Garantia": "1 ano" },
  },
  {
    label: "Notebook Ultra Gamer",
    price: 8999.90,
    description: "Notebook com placa RTX 4070, 32GB RAM, SSD 1TB para jogos pesados.",
    categorySlug: "eletronicos",
    images: ["notebook1.svg", "notebook2.svg"],
    metadatas: { "Marca": "Dell", "Cor": "Preto", "Garantia": "1 ano" },
  },
  {
    label: "Fone de Ouvido Bluetooth",
    price: 299.90,
    description: "Fone sem fio com cancelamento de ruído ativo e 30h de bateria.",
    categorySlug: "eletronicos",
    images: ["fone1.svg"],
    metadatas: { "Marca": "Samsung", "Cor": "Branco", "Garantia": "6 meses" },
  },
  {
    label: "Camiseta Algodão Premium",
    price: 89.90,
    description: "Camiseta 100% algodão, confortável e durável. Disponível em várias cores.",
    categorySlug: "roupas",
    images: ["camiseta1.svg", "camiseta2.svg"],
    metadatas: { "Tamanho": "M", "Cor": "Preto", "Material": "Algodão" },
  },
  {
    label: "Jaqueta Corta-Vento",
    price: 249.90,
    description: "Jaqueta leve e resistente à água, ideal para dias frios e atividades ao ar livre.",
    categorySlug: "roupas",
    images: ["jaqueta1.svg"],
    metadatas: { "Tamanho": "G", "Cor": "Azul", "Material": "Poliéster" },
  },
  {
    label: "Tênis Esportivo Run Fast",
    price: 399.90,
    description: "Tênis com amortecimento avançado e sola antiderrapante para corrida.",
    categorySlug: "roupas",
    images: ["tenis1.svg", "tenis2.svg"],
    metadatas: { "Tamanho": "G", "Cor": "Preto", "Material": "Poliéster" },
  },
  {
    label: "Sofá 3 Lugares Retrátil",
    price: 2599.90,
    description: "Sofá retrátil e reclinável em suede, com braços almofadados e pés cromados.",
    categorySlug: "casa-decoracao",
    images: ["sofa1.svg", "sofa2.svg"],
    metadatas: { "Material": "Tecido", "Cor": "Bege" },
  },
  {
    label: "Mesa de Jantar 6 Lugares",
    price: 1899.90,
    description: "Mesa em vidro temperado com estrutura de aço inox, acompanha 6 cadeiras.",
    categorySlug: "casa-decoracao",
    images: ["mesa1.svg"],
    metadatas: { "Material": "Vidro", "Cor": "Branco" },
  },
  {
    label: "Bicicleta Mountain Bike Aro 29",
    price: 2199.90,
    description: "Bicicleta com 21 marchas, freio a disco e suspensão dianteira.",
    categorySlug: "esportes",
    images: ["bike1.svg", "bike2.svg"],
    metadatas: { "Marca": "Olympikus", "Indicado para": "Unissex" },
  },
  {
    label: "Kit Halteres Academia 20kg",
    price: 349.90,
    description: "Kit com 2 halteres ajustáveis de 10kg cada, revestidos em borracha.",
    categorySlug: "esportes",
    images: ["halteres1.svg"],
    metadatas: { "Marca": "Mormaii", "Indicado para": "Unissex" },
  },
  {
    label: "Livro: A Arte da Guerra",
    price: 29.90,
    description: "Edição especial e comentada do clássico de Sun Tzu sobre estratégia.",
    categorySlug: "livros",
    images: ["livro1.svg"],
    metadatas: { "Editora": "Sextante", "Gênero": "Estratégia", "Formato": "Físico" },
  },
  {
    label: "Livro: O Poder do Hábito",
    price: 44.90,
    description: "Best-seller de Charles Duhigg sobre como construir hábitos positivos.",
    categorySlug: "livros",
    images: ["livro2.svg"],
    metadatas: { "Editora": "Companhia das Letras", "Gênero": "Autoajuda", "Formato": "Físico" },
  },
];

const banners = [
  { img: "fake_banner.svg", link: "/eletronicos" },
  { img: "fake_banner.svg", link: "/esportes" },
  { img: "fake_banner.svg", link: "/roupas" },
];

const users = [
  { email: "joao@teste.com", name: "João Silva", password: "123456" },
  { email: "maria@teste.com", name: "Maria Souza", password: "123456" },
];

const addresses = [
  { userEmail: "joao@teste.com", zipCode: "01310-100", street: "Av. Paulista", number: "1000", city: "São Paulo", state: "SP", country: "Brasil", complement: "Apto 42" },
  { userEmail: "joao@teste.com", zipCode: "01310-200", street: "Rua Augusta", number: "500", city: "São Paulo", state: "SP", country: "Brasil" },
  { userEmail: "maria@teste.com", zipCode: "20040-000", street: "Av. Rio Branco", number: "300", city: "Rio de Janeiro", state: "RJ", country: "Brasil" },
];

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  // Cleanup to allow re-runs
  await prisma.orderProduct.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productMetadata.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.metadataValue.deleteMany();
  await prisma.categoryMetadata.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  // ---------- Banners ----------
  for (const b of banners) {
    await prisma.banner.create({ data: b });
  }
  console.log(`Banners criados: ${banners.length}`);

  // ---------- Categories + Metadata ----------
  for (const catDef of categoryDefs) {
    const cat = await prisma.category.create({
      data: { name: catDef.name, slug: catDef.slug },
    });

    for (const md of catDef.metadata) {
      const createdMd = await prisma.categoryMetadata.create({
        data: { id: `${cat.id}_${md.name}`, categoryId: cat.id, name: md.name },
      });

      for (const value of md.values) {
        await prisma.metadataValue.create({
          data: { id: `${createdMd.id}_${value}`, categoryMetadataId: createdMd.id, value },
        });
      }
    }
  }
  console.log(`Categorias criadas: ${categoryDefs.length}`);

  // ---------- Products + Images + Metadata ----------
  let productCount = 0;
  for (const p of products) {
    const category = await prisma.category.findUnique({ where: { slug: p.categorySlug } });
    if (!category) {
      console.error(`Categoria ${p.categorySlug} não encontrada`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        label: p.label,
        price: p.price,
        description: p.description,
        categoryId: category.id,
        images: { create: p.images.map((url) => ({ url })) },
      },
    });
    productCount++;

    for (const [metaName, metaValue] of Object.entries(p.metadatas)) {
      const cmId = `${category.id}_${metaName}`;
      const mvId = `${cmId}_${metaValue}`;

      await prisma.productMetadata.create({
        data: {
          productId: product.id,
          categoryMetadataId: cmId,
          metadataValueId: mvId,
        },
      });
    }
  }
  console.log(`Produtos criados: ${productCount}`);

  // ---------- Users + Addresses ----------
  for (const u of users) {
    await prisma.user.create({
      data: { email: u.email, name: u.name, password: passwordHash },
    });
  }
  console.log(`Usuários criados: ${users.length}`);

  for (const a of addresses) {
    const user = await prisma.user.findUnique({ where: { email: a.userEmail } });
    if (!user) continue;

    await prisma.userAddress.create({
      data: {
        userId: user.id,
        zipCode: a.zipCode,
        street: a.street,
        number: a.number,
        city: a.city,
        state: a.state,
        country: a.country,
        complement: a.complement ?? null,
      },
    });
  }
  console.log(`Endereços criados: ${addresses.length}`);

  // ---------- Orders ----------
  const allProducts = await prisma.product.findMany();
  const allUsers = await prisma.user.findMany();

  const ordersData = [
    {
      userEmail: "joao@teste.com",
      items: [
        { label: "Smartphone X Pro", qty: 1 },
        { label: "Fone de Ouvido Bluetooth", qty: 2 },
      ],
    },
    {
      userEmail: "maria@teste.com",
      items: [
        { label: "Camiseta Algodão Premium", qty: 3 },
        { label: "Livro: O Poder do Hábito", qty: 1 },
      ],
    },
    {
      userEmail: "joao@teste.com",
      items: [
        { label: "Notebook Ultra Gamer", qty: 1 },
        { label: "Kit Halteres Academia 20kg", qty: 1 },
      ],
    },
  ];

  let orderCount = 0;
  const salesUpdates: { id: string; qty: number }[] = [];
  for (const od of ordersData) {
    const user = allUsers.find((u) => u.email === od.userEmail);
    if (!user) continue;

    const productMap = new Map(allProducts.map((p) => [p.label, p]));
    let total = 0;
    const orderItems = [];

    for (const item of od.items) {
      const product = productMap.get(item.label);
      if (!product) {
        console.warn(`Produto "${item.label}" não encontrado para pedido`);
        continue;
      }
      total += product.price * item.qty;
      orderItems.push({
        productId: product.id,
        quantity: item.qty,
        price: product.price,
      });
      salesUpdates.push({ id: product.id, qty: item.qty });
    }

    if (orderItems.length === 0) continue;

    await prisma.order.create({
      data: {
        userId: user.id,
        status: "paid",
        total,
        shippingCost: 15.0,
        shippingDays: 5,
        shippingZipCode: "01310-100",
        shippingStreet: "Av. Paulista",
        shippingNumber: "1000",
        shippingCity: "São Paulo",
        shippingState: "SP",
        shippingCountry: "Brasil",
        orderItems: { create: orderItems },
      },
    });
    orderCount++;
  }
  console.log(`Pedidos criados: ${orderCount}`);

  // Update salesCount on products
  for (const s of salesUpdates) {
    await prisma.product.update({
      where: { id: s.id },
      data: { salesCount: { increment: s.qty } },
    });
  }
  console.log(`SalesCount atualizado para ${salesUpdates.length} produtos`);

  console.log("\nSeed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
