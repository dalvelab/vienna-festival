var cartBadgeNumber = $('.cart-round-qty');

if(cartBadgeNumber.html() === '') {
  cartBadgeNumber.css('display', 'none');
}

$('#open-cart').click(function(){
  if(cartBadgeNumber.html() === '') {
    $('.hidden-cart').css('display', 'none');
    $('#open-cart').css('display', 'block');
    $('.cart-round-qty').css('display', 'none');
  } else if(cartBadgeNumber.html() === '0') {
    $('.hidden-cart').css('display', 'none');
    $('#open-cart').css('display', 'block');
    $('.cart-round-qty').css('display', 'flex');
  } else {
    $('.hidden-cart').css('display', 'flex');
    $('#open-cart').css('display', 'none');
    $('.cart-round-qty').css('display', 'none');
  } 
});

$('#close-cart').click(function(){
  $('.hidden-cart').css('display', 'none');
  $('#open-cart').css('display', 'block');
  $('.cart-round-qty').css('display', 'flex');
});