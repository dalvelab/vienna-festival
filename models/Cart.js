module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(item, id, size) {
    var storedItem = this.items[id, size];
    if(!storedItem) {
      storedItem = this.items[id, size] = {item: item, qty: 0, price: 0, size: size};
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  }

  this.removeItem = function(id, size) {
    this.totalQty -= this.items[id, size].qty;
    this.totalPrice -= this.items[id, size].price;
    delete this.items[id, size];
  }

  this.addOneItem = function(id, size) {
    var storedItem = this.items[id, size];
    this.storedItem.qty++;
    storedItem.price = stored.item.price * storedItem.qty
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  }

  this.generateArray = function() {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  }
};