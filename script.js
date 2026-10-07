// ==========================================
// SwiftCab Fare Calculator
// ==========================================


// Fixed values - const
const BASE_FARE = 50;
const GST_RATE = 0.05;

const MINI_RATE = 10;
const SEDAN_RATE = 14;
const SUV_RATE = 18;

const NIGHT_SURCHARGE_RATE = 0.25;
const PRIME_DISCOUNT = 0.15;
const NORMAL_DISCOUNT = 0.10;


// ==========================================
// var vs let scope example
// ==========================================

function scopeExample() {

    if (true) {

        var oldVariable = "I am var";
        let newVariable = "I am let";

        console.log(oldVariable);
        console.log(newVariable);
    }

    console.log(oldVariable);

    // let is block scoped, so it cannot be accessed here.
    // console.log(newVariable); // Error
}


// ==========================================
// Function to get rate per km
// Uses switch statement
// ==========================================

function getRatePerKm(rideType) {

    let rate;

    switch (rideType) {

        case "Mini":
            rate = MINI_RATE;
            break;

        case "Sedan":
            rate = SEDAN_RATE;
            break;

        case "SUV":
            rate = SUV_RATE;
            break;

        default:
            rate = 0;
    }

    return rate;
}


// ==========================================
// Calculate final fare
// ==========================================

function calculateFare(distance, rate, hour, isPrime) {

    // Step 1:
    // Base fare + distance fare

    let baseDistanceFare = BASE_FARE + (distance * rate);

    let surcharge = 0;
    let discount = 0;


    // Step 2:
    // Night surcharge
    // Night = 22-23 OR 0-5

    if ((hour >= 22 && hour <= 23) || (hour >= 0 && hour <= 5)) {

        surcharge = baseDistanceFare * NIGHT_SURCHARGE_RATE;
    }


    // Fare after night surcharge
    let fareAfterSurcharge = baseDistanceFare + surcharge;


    // Step 3:
    // Long ride discount
    // Distance more than 20 km

    if (distance > 20) {

        // Nested if for Prime / Non-Prime

        if (isPrime) {
            discount = fareAfterSurcharge * PRIME_DISCOUNT;
        } else {
            discount = fareAfterSurcharge * NORMAL_DISCOUNT;
        }
    }


    // Fare after discount
    let fareAfterDiscount = fareAfterSurcharge - discount;


    // Step 4:
    // GST

    let gst = fareAfterDiscount * GST_RATE;

    let finalFare = fareAfterDiscount + gst;


    return {
        baseDistanceFare: baseDistanceFare,
        surcharge: surcharge,
        discount: discount,
        gst: gst,
        finalFare: finalFare
    };
}


// ==========================================
// Main Calculate Function
// ==========================================

function calculate() {

    // Values that change - let

    let customerName =
        document.getElementById("customerName").value.trim();

    let rideType =
        document.getElementById("rideType").value;

    let distance =
        Number(document.getElementById("distance").value);

    let pickupHour =
        Number(document.getElementById("pickupHour").value);

    let isPrime =
        document.getElementById("primeMember").checked;


    let result =
        document.getElementById("result");


    // ==========================================
    // Input Validation
    // ==========================================

    if (customerName === "") {

        result.innerHTML =
            "<p class='error'>Error: Customer name cannot be empty.</p>";

        return;

    } else if (distance <= 0 || distance > 200 || isNaN(distance)) {

        result.innerHTML =
            "<p class='error'>Error: Distance must be more than 0 km and not more than 200 km.</p>";

        return;

    } else if (pickupHour < 0 || pickupHour > 23 || isNaN(pickupHour)) {

        result.innerHTML =
            "<p class='error'>Error: Pickup hour must be between 0 and 23.</p>";

        return;
    }


    // ==========================================
    // Get rate
    // ==========================================

    let rate = getRatePerKm(rideType);


    // ==========================================
    // Calculate actual fare
    // ==========================================

    let fare = calculateFare(
        distance,
        rate,
        pickupHour,
        isPrime
    );


    // ==========================================
    // Fare Chart using FOR loop
    // 5, 10, 15 ... 50 km
    // Day-time fare including GST
    // No discount
    // ==========================================

    let fareChart = `
        <h3>Fare Chart - ${rideType}</h3>

        <table>
            <thead>
                <tr>
                    <th>Distance</th>
                    <th>Fare Including GST</th>
                </tr>
            </thead>

            <tbody>
    `;


    for (let km = 5; km <= 50; km += 5) {

        // Day-time fare
        let chartBaseFare = BASE_FARE + (km * rate);

        let chartGST = chartBaseFare * GST_RATE;

        let chartFinalFare = chartBaseFare + chartGST;


        fareChart += `
            <tr>
                <td>${km} km</td>
                <td>₹${chartFinalFare.toFixed(2)}</td>
            </tr>
        `;
    }


    fareChart += `
            </tbody>
        </table>
    `;


    // ==========================================
    // Wallet Calculation using WHILE loop
    // Wallet = ₹1000
    // ==========================================

    const WALLET_BALANCE = 1000;

    let walletBalance = WALLET_BALANCE;

    let numberOfRides = 0;


    while (walletBalance >= fare.finalFare) {

        walletBalance -= fare.finalFare;

        numberOfRides++;
    }


    // ==========================================
    // Display Result
    // ==========================================

    result.innerHTML = `

        <h2 class="success">Fare Summary</h2>

        <p><strong>Customer Name:</strong>
            ${customerName}
        </p>

        <p><strong>Ride Type:</strong>
            ${rideType}
        </p>

        <p><strong>Distance:</strong>
            ${distance} km
        </p>

        <p><strong>Rate per km:</strong>
            ₹${rate.toFixed(2)}
        </p>

        <p><strong>Base + Distance Fare:</strong>
            ₹${fare.baseDistanceFare.toFixed(2)}
        </p>

        <p><strong>Night Surcharge:</strong>
            ₹${fare.surcharge.toFixed(2)}
        </p>

        <p><strong>Long-Ride Discount:</strong>
            ₹${fare.discount.toFixed(2)}
        </p>

        <p><strong>GST (5%):</strong>
            ₹${fare.gst.toFixed(2)}
        </p>

        <h3>
            Final Fare: ₹${fare.finalFare.toFixed(2)}
        </h3>

        ${fareChart}

        <h3>Wallet Result</h3>

        <p>
            Wallet Balance: ₹${WALLET_BALANCE.toFixed(2)}
        </p>

        <p>
            Number of rides affordable:
            <strong>${numberOfRides}</strong>
        </p>

        <p>
            Balance left:
            <strong>₹${walletBalance.toFixed(2)}</strong>
        </p>
    `;
}