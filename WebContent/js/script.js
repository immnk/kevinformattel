$(document).ready(function() {
    var sections = ['#loader', '#welcome', '#pdp', '#pdpgrid', "#upsale", "#reviewpage",
        "#discount", "#searchResultPage", "#billing"
    ];
    var currentSection = '';

    var content = $('#footerText');
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.text('Sorry, but your browser doesn\'t support WebSockets.');
        return;
    }

    // open connection
    var connection = new WebSocket('ws://127.0.0.1:1337');
    $.each(sections, function(index) {
        console.log(sections[index] + " is being hidden");
        $(sections[index]).hide();
    })

    connection.onopen = function() {
        currentSection = sections[0];
        console.log('current section: ' + currentSection);
        $(currentSection).show(200);
    }

    connection.onerror = function(error) {
        // just in there were some problems with conenction...
        content.html('Sorry, but there\'s some problem with your connection or the server is down.');
    }

    // most important part - incoming messages
    connection.onmessage = function(message) {
        console.log('Message received from server');
        console.log(message);

        try {
            json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ',
                message.data);
            return;
        }

        $(currentSection).hide();

        if (json.type == 'loader') {
            currentSection = sections[0];
        } else if (json.type == 'welcome') {
            currentSection = sections[1];
        } else if (json.type == 'pdp') {
            currentSection = sections[2];
            formPDPData(json.data, currentSection);
        } else if (json.type == 'text') {
            content.text(json.data);
        } else if (json.type == 'pdpgrid') {
            currentSection = sections[3];
            formGridData(json.data);
        } else if (json.type == 'upsale') {
            currentSection = sections[4];
            formUpSalesData(json.data, currentSection);
        } else if (json.type == 'reviews') {
            currentSection = sections[5];
        } else if (json.type == 'discount') {
            currentSection = sections[6];
            formDiscountData(json.data);
        } else if (json.type == 'search') {
            currentSection = sections[7];
            formImageGrid(json.data);
        } else if (json.type == 'bill') {
            currentSection = sections[8];
            formBillData(json.data);
        }

        console.log('current section' + currentSection);
        $(currentSection).show();
    }

    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    setInterval(function() {
        if (connection.readyState !== 1) {
            content.text('Unable to communicate with the WebSocket server.');
        }
    }, 3000);

    $("#changeToPDP").click(function(event) {
        $.ajax('http://localhost:8080/sendPDP').then(function(response) {
            console.log('succesfully hit the server to change the content');
        })
    });

    $("#changeToGrid").click(function(event) {
        $.ajax('http://localhost:8080/sendGrid').then(function(response) {
            console.log('succesfully hit the server to change the content');
        })
    });

    $("#changeToSale").click(function(event) {
        $.ajax('http://localhost:8080/sendSales').then(function(response) {
            console.log('succesfully hit the server to change the content');
        })
    });

    $("#changeToDiscount").click(function(event) {
        $.ajax('http://localhost:8080/sendDiscount').then(function(response) {
            console.log('succesfully hit the server to change the content');
        })
    });

    $("#changeToSearch").click(function(event) {
        $.ajax('http://localhost:8080/sendSearch').then(function(response) {
            console.log('succesfully hit the server to change the content');
        })
    });

    $("#changeToBill").click(function(event) {
        $.ajax('http://localhost:8080/sendBill').then(function(response) {
            console.log('succesfully hit the server to change the content');
        })
    });

    $(".card").click(function(event) {
        console.log('card is clicked.');
        currentSection = sections[2];
        $(currentSection).show();
    });

});

function formPDPData(data, currentSection) {
    console.log('In formPDPData function');
    console.log(data);

    var product = data.product[0];
    $("#pdpImage").css('background-image', 'url(' + product.imageURL + ')');
    $("#pdp header .title").text(product.name);
    $("#pdp section .price").text("$ " + product.price);
    $("#pdp section .location").text(product.location);

    if (data.reviews && data.reviews[0].reviews.length > 0) {
        var reviews = data.reviews[0].reviews;
        $('#pdp_review_number').text(reviews.length + " reviews available");
        console.log(reviews);
        var reviewsHtmlString = "";
        $.each(reviews, function(index) {
            reviewsHtmlString += '<li class="animated slideIn">' + reviews[index].review + '</li>';
        });
        console.log(reviewsHtmlString);
        $(".reviews_section ul.reviews").empty().append(reviewsHtmlString);
    } else {
        $(".reviews_section ul.reviews").empty();
    }

    console.log(product.available);
    if (product.available) {
        console.log('data available - true');
        $("#pdp .not_available").show();
    } else {
        $("#pdp .not_available").hide();
    }

    if (product.sizes) {

    } else {
        $('#pdpSizes').hide();
    }

    adjustCard(currentSection);
}

function formUpSalesData(data, currentSection) {
    console.log('In form upsale downsale method');
    console.log(data);

    var productInfo = data.productInfo[0];
    var upSale = data.saleInfo.upSale;
    var crossSale = data.saleInfo.crossSale;

    $("#upsale .selected_product").attr('src', productInfo.imageURL);

    var upsaleData = "";
    $.each(upSale, function(index) {
        upsaleData += `
            <div class="card animated fadeIn">
                <img src="` + upSale[index].imageUrl + `" alt="product" class="card-image">
                <section class="card-details">
                    <h3 class="card-title">` + upSale[index].name + `</h3>
                    <div class="card-price">$ ` + upSale[index].price + `</div>
                    `
        if (upSale[index].size) {
            upsaleData += `<div class="card-price">$ ` + upSale[index].size + `</div>`;
        }
        upsaleData += `<div class="card_location">` + upSale[index].location + `</div>
                </section>
            </div>`;
    });

    $('#upsale .upsale').html(upsaleData);

    var crosssaleData = "";
    $.each(crossSale, function(index) {
        crosssaleData += `
            <div class="card animated fadeIn">
                <img src="` + crossSale[index].imageUrl + `" alt="product" class="card-image">
                <section class="card-details">
                    <h3 class="card-title">` + crossSale[index].name + `</h3>
                    <div class="card-price">$ ` + crossSale[index].price + `</div>
                    <div class="card_location">` + crossSale[index].location + `</div>
                </section>
            </div>
        `
    });

    $('#upsale .crosssale').html(crosssaleData);

    adjustCard(currentSection);
}

function formGridData(data) {
    console.log('In formGridData fn');
    console.log(data);

    var gridData = "";
    $.each(data, function(index) {
        data[index].price = '23.99';
        data[index].location = '1 floor';

        if (data[index].size) {
            gridData += `
            <div class="card animated fadeIn">
                    <img src="` + data[index].imageURL + `" alt="product" class="card-image">
                    <section class="card-details">
                        <h3 class="card-title">` + data[index].name + `</h3>
                        <div class="card-price">$ ` + data[index].price + `</div>
                        <div class="card-sizes">Sizes: ` + data[index].size + `</div>
                        <div class="card_location">` + data[index].location + `</div>
                    </section>
                </div>
            `
        } else {
            gridData += `
            <div class="card animated fadeIn">
                    <img src="` + data[index].imageURL + `" alt="product" class="card-image">
                    <section class="card-details">
                        <h3 class="card-title">` + data[index].name + `</h3>
                        <div class="card-price">$ ` + data[index].price + `</div>
                        <div class="card_location">` + data[index].location + `</div>
                    </section>
                </div>
            `
        }
    });

    $("#pdpgrid .grid").html(gridData);
}

function formDiscountData(data) {
    console.log('in formDiscountData');
    console.log(data);

    $("#truePrice").html(data.price);
    $("#discountPrice").html(data.discountedPrice);
    $("#discount h3.product_name").html(data.name);
    $("#discount .product_image").css('background-image', 'url(' + data.imageURL + ')');
}

function adjustCard(currentSection) {
    console.log(currentSection + " h3.card-title");
    var cards = $(currentSection + " h3.card-title");
    console.log(cards);

    $.each(cards, function(index) {
        var card_title = cards[index];
        console.log($(card_title).text());
        var numWords = $(card_title).text().split("").length;
        console.log(numWords);
        if (numWords < 20)
            $(card_title).css("font-size", "26px");
        else if (numWords < 30)
            $(card_title).css("font-size", "20px");
        else if (numWords < 40)
            $(card_title).css("font-size", "18px");
        else if (numWords < 50)
            $(card_title).css("font-size", "16px");
        else
            $(card_title).css("font-size", "14px");
    })

}

function formImageGrid(data) {
    console.log('In formImageGrid');
    console.log(data);

    if (data) {
        var imageList = "";
        $.each(data, function(index) {
            imageList += '<li class="animated fadeIn"><span>' + data[index].description + '</span></li>';
        });
        $("#searchResultPage ul.image_list").empty().append(imageList);
        $("#searchResultPage ul.image_list li").css('background-image', function(index) {
            return 'url(' + data[index].url + ')';
        });
    } else {

    }
}

function formBillData(data) {
    console.log('In formBillData');
    console.log(data);

    $("#billing h2.price").html("$ " + data.totalPrice);

    var billsList = "";
    $.each(data.productData, function(index) {
        var product = data.productData[index];
        billsList += `
        <section class="bill card-5 animated fadeIn">
                <section class="head_wrapper">
                    <h2 class="title">` + product.name + `</h2>
                    <div class="product_image" style="background-image:url(` + product.imageURL + `)"></div>
                </section>
                <table class="details">
                    <tr>
                        <td>model id</td>
                        <td>#` + product.catId + `</td>
                    </tr>
                    <tr>
                        <td>size</td>
                        <td>` + product.size + `</td>
                    </tr>
                    <tr>
                        <td>qty</td>
                        <td>1</td>
                    </tr>
                    <tr>
                        <td>price</td>
                        <td>$ ` + product.price + `</td>
                    </tr>
                </table>
            </section>
        `
    });

    $("#billing .bill_container").empty().append(billsList);
}
