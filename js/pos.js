$(document).ready(function() {
    var sl = 0;
    var quantity;
    var unitprice;
    var grandTotal = 0.0;
    var discountInPercentage = 15;
    var discount = discountInPercentage/100;
    var vat = 0.05;
    var totalVat = 0.0;
    var payableAmount = 0.0;
    var bill = 0.0;
    var registeredCustomer;
    var phoneNo = '';
    var customerName = '';


    $('#add-customer-btn').click(function() {
        $('#add-customer-form').show();
    });

    $('#floatingSelect').select2();
    $('#customerDropdown').select2();

    $('#adjust').change(function() {
        var adjust = parseFloat($('#adjust').val());
        var payable = parseFloat($('#payable-amount').val());
        bill = payable - adjust;
        $('#bill').val(bill);
    });

    $('#paymentTypeSelect').change(function() {
        if ($(this).val() === 'card') {
            $('#bank-select-section').show();
        }else {
            $('#bank-select-section').hide();
            $('#card-no-section').hide();
            $('#bankSelect').val("");
            $('#card-no').val("");
        }
        $('#bankSelect').change(function() {
            if ($(this).val() != '') {
                $('#card-no-section').show();
            }else {
                $('#card-no-section').hide();
                $('#bankSelect').val("");
                $('#card-no').val("");
            }               
        });
        
    });

    $('#receive').on('change', function() {
        var adjustValue = 0.0;
        var rcvValue = parseFloat($('#receive').val());
        var payableValue = parseFloat($('#payable-amount').val());

        if($('#adjust').val() !== '')
        {
            adjustValue = parseFloat($('#adjust').val());
        }
        var changeBDT = rcvValue - (payableValue-adjustValue);
    
        $('#dueField').val(changeBDT);
    });
    
    $('#myForm').submit(function(event) {
        event.preventDefault(); // Prevent default form submission
        sl++;
        // registeredCustomer = $('#customerDropdown').val();
        // console.log(registeredCustomer);
        // if(registeredCustomer !== '')
        // {
        //     var parts = registeredCustomer.split('-');
        //     phoneNo = $.trim(parts[0]);
        //     customerName = $.trim(parts[1]);
        // }else{
        //     phoneNo ='';
        //     customerName ='';
        // }
        var selectedOption = $('#floatingSelect').val(); // Get the selected option
        unitprice = $('#id1').val();
        quantity = $('#id2').val();
        var total = unitprice * quantity;
        total = total - (total * discount);
        if (selectedOption !== '' ) {
            var newRow = '<tr><td>' + sl + '</td><td>' + selectedOption + '</td><td class="unit">' + unitprice + '</td><td class="qty">' + quantity + '</td><td class="discount-col">' + discountInPercentage + '</td><td class="total">' + total + '</td><td><button class="increase"><i class="bi bi-caret-up-fill"></i></button><button class="decrease"><i class="bi bi-caret-down-fill"></i></button><button class="delete-btn"></i><i class="bi bi-trash-fill"></i></button></td></tr>'; // Create a new row with the selected option
            $('#dataTable tbody').append(newRow); // Append the new row to the table body
        }

        grandTotal = 0.0;
        $('#dataTable tbody tr').each(function() {
            var price = parseFloat($(this).find('td:eq(5)').text());
            grandTotal += price;
        });

        totalVat = grandTotal * vat;
        payableAmount = grandTotal + totalVat;
        bill = payableAmount;
        $('#grand-total').val(grandTotal);
        $('#discount-btn').val(discountInPercentage);
        $('#vat').val(totalVat);
        $('#payable-amount').val(payableAmount);
        $('#bill').val(bill);
        $('#nameDup').val(customerName);
        $('#phoneDup').val(phoneNo);
        $('#floatingSelect').val('');
        $('#id1').val('');
        $('#id2').val('');
        

    });

    $(document).on('click', '.delete-btn', function() {
        $(this).closest('tr').remove(); // Remove the row containing the clicked delete button
    });

    $(document).on('click', '.increase', function() {
        var quantityElement = $(this).closest('tr').find('.qty');
        var quantityValue = parseInt(quantityElement.text())+1;
        quantityElement.text(quantityValue);

        var unitPriceElement = $(this).closest('tr').find('.unit');
        var unitPriceValue = parseInt(unitPriceElement.text());

        var totalElement = $(this).closest('tr').find('.total');
        var totalValue = quantityValue * unitPriceValue;
        totalValue = totalValue - (totalValue*discount);
        totalElement.text(totalValue);


        grandTotal = 0.0;
        $('#dataTable tbody tr').each(function() {
            var price = parseFloat($(this).find('td:eq(5)').text());
            grandTotal += price;
        });
        totalVat = grandTotal * vat;
        payableAmount = grandTotal + totalVat;

        $('#grand-total').val(grandTotal);
        $('#vat').val(totalVat);
        $('#payable-amount').val(payableAmount);
        //$('.qty').text(quantityValue);
        //$('.total').text(totalPrice);
    });
    $(document).on('click', '.decrease', function() {
        var quantityElement = $(this).closest('tr').find('.qty');
        var quantityValue = parseInt(quantityElement.text())-1;
        quantityElement.text(quantityValue);

        var unitPriceElement = $(this).closest('tr').find('.unit');
        var unitPriceValue = parseInt(unitPriceElement.text());

        var totalElement = $(this).closest('tr').find('.total');
        var totalValue = quantityValue * unitPriceValue;
        totalValue = totalValue - (totalValue*discount);
        totalElement.text(totalValue);

        grandTotal = 0.0;

        $('#dataTable tbody tr').each(function() {
            var price = parseFloat($(this).find('td:eq(5)').text());
            grandTotal += price;
        });

        totalVat = grandTotal * vat;
        payableAmount = grandTotal + totalVat;
        $('#grand-total').val(grandTotal);
        $('#vat').val(totalVat);
        $('#payable-amount').val(payableAmount);
        //$('.qty').text(quantityValue);
        //$('.total').text(totalPrice);
    });
    $('#finalSubmit-form').submit(function(event) {
        
        event.preventDefault(); // Prevent form submission
        
        var formData = $(this).serializeArray();
        var jsonObject = {};
        $.each(formData, function(index, field) {
            jsonObject[field.name] = field.value;
        });
        console.log(JSON.stringify(jsonObject));

        var jsonHtml = '<h2 class="text-center">JSON Data</h2>';
        
        jsonHtml += '<p>'+ JSON.stringify(jsonObject) +'</p>';
        $('#json-view').html(jsonHtml);

        var selectedOption = $('#paymentTypeSelect').val();
        var bankName = $('#bankSelect').val();
        var cashReceive = parseFloat(($('#receive').val()));
        var cashChange = parseFloat(($('#dueField').val()));
        var cardNo = parseInt(($('#card-no').val()));
        var  adjustValue = 0.0;
        if($('#adjust').val() !== '')
        {
            adjustValue = parseFloat($('#adjust').val());
        }

        var bill = payableAmount-adjustValue;
        var invoiceHTML = '<h2 class="text-center mb-4 p-3">Point of Sale Invoice</h2>';
        invoiceHTML += '<div class="row p-3">';
        invoiceHTML += '<div class="col-md-6">';
        invoiceHTML += '<h5>Company Information:</h5>';
        invoiceHTML += '<p>Company Name</p>';
        invoiceHTML += '<p>Address Line 1</p>';
        invoiceHTML += '<p>Address Line 2</p>';
        invoiceHTML += '<p>City, State, Zip Code</p>';
        invoiceHTML += '</div>';
        invoiceHTML += '<div class="col-md-6 text-md-right">';
        invoiceHTML += '<h5>Bill Details:</h5>';
        invoiceHTML += '<p><strong>Bill No:</strong> 12345</p>';
        invoiceHTML += '<p><strong>Date:</strong> July 11, 2023</p>';
        invoiceHTML += '<p><strong>Time:</strong> 10:00 AM</p>';
        invoiceHTML += '</div>';
        invoiceHTML += '</div>';

        // Generate invoice HTML
        invoiceHTML += '<div class="invoice">';
        invoiceHTML += '<table class="table table-bordered mt-4 invoice">';
        invoiceHTML += '<thead>';
        invoiceHTML += '<tr>';
        invoiceHTML += '<th>Item</th>';
        invoiceHTML += '<th>Price</th>';
        invoiceHTML += '<th>Qty</th>';
        invoiceHTML += '<th>Discount(%)</th>';
        invoiceHTML += '<th>Total</th>';
        invoiceHTML += '</tr>';
        invoiceHTML += '</thead>';
        invoiceHTML += '<tbody>';
        
        $('#dataTable tbody tr').each(function() {
            var item = $(this).find('td:eq(1)').text();
            var itemPrice = parseFloat($(this).find('td:eq(2)').text());
            var itemQty = parseFloat($(this).find('td:eq(3)').text());
            var itemDiscount = parseFloat($(this).find('td:eq(4)').text());
            var itemTotalPrice = parseFloat($(this).find('td:eq(5)').text());
            
            invoiceHTML += '<tr>';
            invoiceHTML += '<td>'+ item +'</td>';
            invoiceHTML += '<td>'+ itemPrice +'</td>';
            invoiceHTML += '<td>'+ itemQty +'</td>';
            invoiceHTML += '<td>'+ itemDiscount +'</td>';
            invoiceHTML += '<td>'+ itemTotalPrice +'</td>';
            invoiceHTML += '</tr>'; 
        });

        invoiceHTML += '</tbody>';
        invoiceHTML += '<tfoot>';
        invoiceHTML += '<tr>';
        invoiceHTML += '<td colspan="4" class="text-right">Grand Total: </td>';
        invoiceHTML += '<td>'+ grandTotal +'</td>';
        invoiceHTML += '</tr>';
        invoiceHTML += '<tr>';
        invoiceHTML += '<td colspan="4" class="text-right">Vat: </td>';
        invoiceHTML += '<td>'+ totalVat +'</td>';
        invoiceHTML += '</tr>';
        invoiceHTML += '<tr>';
        invoiceHTML += '<td colspan="4" class="text-right">Payable Amount: </td>';
        invoiceHTML += '<td>'+ payableAmount +'</td>';
        invoiceHTML += '</tr>';
        invoiceHTML += '<tr>';
        invoiceHTML += '<td colspan="4" class="text-right">Adjust: </td>';
        invoiceHTML += '<td>'+ adjustValue +'</td>';
        invoiceHTML += '</tr>'; 
        invoiceHTML += '<tr>';
        invoiceHTML += '<td colspan="4" class="text-right">Bill: </td>';
        invoiceHTML += '<td>'+ bill +'</td>';
        invoiceHTML += '</tr>'; 
        invoiceHTML += '<tr>';
        invoiceHTML += '<td colspan="4" class="text-right">Payment Type: </td>';
        invoiceHTML += '<td>'+ selectedOption +'</td>';
        invoiceHTML += '</tr>';
        if(selectedOption == 'card')
        {
            invoiceHTML += '<tr>';
            invoiceHTML += '<td colspan="4" class="text-right">Bank Name: </td>';
            invoiceHTML += '<td>'+ bankName +'</td>';
            invoiceHTML += '</tr>';

            if(bankName !== '')
            {
                invoiceHTML += '<tr>';
                invoiceHTML += '<td colspan="4" class="text-right">Card No: </td>';
                invoiceHTML += '<td>'+ cardNo +'</td>';
                invoiceHTML += '</tr>';
            }                   
        }  
        invoiceHTML += '<tr>';
        invoiceHTML += '<td colspan="4" class="text-right">Cash Received: </td>';
        invoiceHTML += '<td>'+ cashReceive +'</td>';
        invoiceHTML += '</tr>'; 
        invoiceHTML += '<tr>';
        invoiceHTML += '<td colspan="4" class="text-right">Cash Change: </td>';
        invoiceHTML += '<td>'+ cashChange +'</td>';
        invoiceHTML += '</tr>';                       
        invoiceHTML += '</tfoot>';
        invoiceHTML += '</table>';
        
        invoiceHTML += '<div class="text-center">';
        invoiceHTML += '<button class="btn btn-primary mt-3">Print Invoice</button>';
        invoiceHTML += '</div>';
        invoiceHTML += '</div>';

        // Display invoice
        $('#invoiceResult').html(invoiceHTML);
    });
});