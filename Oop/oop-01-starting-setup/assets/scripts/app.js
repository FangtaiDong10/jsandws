class Product {
  // title = "default";
  // imageUrl;
  // description;
  // price;

  constructor(title, image, desc, price) {
    this.title = title;
    this.imageUrl = image;
    this.description = desc;
    this.price = price;
  }
}

class ElementAttribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

class Component {
  constructor(renderHookId, shouldRender = true) {
    this.hookId = renderHookId;
    if (shouldRender) {
      this.render();
    }
  }

  render() {}

  createRootElement(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);
    if (cssClasses) {
      rootElement.className = cssClasses;
    }

    // attributes --> is an array
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        // rootElement have setAttribute method
        rootElement.setAttribute(attr.name, attr.value);
      }
    }

    document.getElementById(this.hookId).append(rootElement);
    return rootElement;
  }
}

class ShoppingCart extends Component {
  items = [];

  set cartItems(value) {
    this.items = value;
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(
      2
    )}</h2>`;
  }

  get totalAmount() {
    const sum = this.items.reduce((preValue, curItem) => {
      return preValue + curItem.price;
    }, 0);
    return sum;
  }

  constructor(renderHookId) {
    super(renderHookId, false);
    this.orderProducts = () => {
      console.log("ordering");
      // this here is refer to the button
      console.log(this.items);
    };
    this.render();
  }

  addProduct(product) {
    const updateItems = [...this.items];
    updateItems.push(product);
    this.cartItems = updateItems;
  }

  render() {
    // const cartEl = document.createElement("section");
    const cartEl = this.createRootElement("section", "cart");
    cartEl.innerHTML = `
      <h2>Total: \$${0}</h2>
      <button>Order Now !</button>
    `;
    // cartEl.className = "cart";
    const orderButton = cartEl.querySelector("button");
    orderButton.addEventListener("click", this.orderProducts);
    // will automatically create a new field
    this.totalOutput = cartEl.querySelector("h2");

    // return cartEl;
  }
}

// productList object
class ProductList extends Component {
  #products = [];

  constructor(renderHookId) {
    super(renderHookId, false);
    this.render();
    this.fetchProducts();
  }

  fetchProducts() {
    this.#products = [
      new Product(
        "A Pillow",
        "https://www.maxpixel.net/static/photo/2x/Soft-Pillow-Green-Decoration-Deco-Snuggle-1241878.jpg",
        "A soft pillow!",
        19.99
      ),
      new Product(
        "A Carpet",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ardabil_Carpet.jpg/397px-Ardabil_Carpet.jpg",
        "A carpet which you might like - or not.",
        89.99
      ),
    ];

    // when I got my products --> renderProducts agin
    this.renderProducts();
  }

  renderProducts() {
    // prodList.id = "prod-list";
    // prodList.className = "product-list";
    for (const prod of this.#products) {
      // Because ProductItem constructor passed a product object into this function as
      // arguments
      new ProductItem(prod, "prod-list");
      // productItem.render();
      // DOM manipulation --> append prodEl(li) into the prodListEL(ul)
      // prodList.append(prodEl);
    }
    // return prodList;
  }

  // render method
  render() {
    this.createRootElement("ul", "product-list", [
      new ElementAttribute("id", "prod-list"),
    ]);

    if (this.#products && this.#products.length > 0) {
      this.renderProducts();
    }
  }
}

// product item class
class ProductItem extends Component {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }

  addToCart() {
    App.addProductToCart(this.product);
  }

  render() {
    const prodEl = this.createRootElement("li", "produc-item");
    // prodEl.className = "product-item";
    prodEl.innerHTML = `
        <div>
          <img src="${this.product.imageUrl}" alt="${this.product.title}" >
          <div class="product-item__content">
            <h2>${this.product.title}</h2>
            <h3>\$${this.product.price}</h3>
            <p>${this.product.description}</p>
            <button>Add to Cart</button>
          </div>
        </div>
      `;
    const addCartButton = prodEl.querySelector("button");

    // here "this" is represented as the instance of productItem
    // bind "this" means --> need to bind this product and pass it to the method of addToCart()
    addCartButton.addEventListener("click", this.addToCart.bind(this));

    // return prodEl;
  }
}

// Shop template
class Shop extends Component {
  constructor() {
    super();
  }

  render() {
    // const renderHook = document.getElementById("app");

    // initialize cart and render cart
    // "this" --> can regard as new property
    // forwarding the renderHookId to the ShoppingCart parent class --> Component (extended by ShoppingCart class)
    this.cart = new ShoppingCart("app");
    // this.cart.render();

    // initialize productList and render productList
    new ProductList("app");
    // console.log(productList.#products);

    // productList.render();

    // renderHook.append(prodList);
  }
}

class App {
  static cart;

  static init() {
    const shop = new Shop();
    // shop.render();
    this.cart = shop.cart;
  }

  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}

// main
App.init();
