document.addEventListener('DOMContentLoaded', () => {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const displayDays = document.getElementById('total-days');
    const totalValueDisplay = document.getElementById('display-total');
    
    const basePriceElement = document.getElementById('base-price');
    if (!startDateInput || !endDateInput || !basePriceElement) return;

    const rawPrice = basePriceElement.getAttribute('data-price') || '';
    
    const baseRate = parseFloat(rawPrice.replace(/[^0-9.-]+/g, "")); 

    if (isNaN(baseRate)) {
        console.error("Booking Calculator Error: Could not parse daily rate as a valid number. Value found:", rawPrice);
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    startDateInput.setAttribute('min', today);

    function calculateInvoice(){
        const startVal = startDateInput.value;
        const endVal = endDateInput.value;

        if (startVal && endVal) {
            const date1 = new Date(startVal);
            const date2 = new Date(endVal);

            const timeDiff = date2.getTime() - date1.getTime();
            
            const days = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

            if (days > 0) {
                displayDays.textContent = days;
                totalValueDisplay.textContent = (days * baseRate).toFixed(2);
            } else {
                displayDays.textContent = '0';
                totalValueDisplay.textContent = '0.00';
            }
        }
    }

    startDateInput.addEventListener('change', () => {
        endDateInput.min = startDateInput.value;
        calculateInvoice();
    });
    endDateInput.addEventListener('change', calculateInvoice);
});