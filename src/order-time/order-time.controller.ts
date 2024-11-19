import {
  ApiOrderTimeValidationOperation,
  ApiOrderTimeValidationBody,
  ApiOrderTimeValidationResponse,
  ApiOrderTimeValidationResponse400,
} from './swagger-order-time.decorator';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderTimeService } from './order-time.service';
import { OrderTimeValidationDto } from '../dtos/order-time-validation.dto';

@Controller('order-time')
export class OrderTimeController {
  constructor(private readonly orderTimeService: OrderTimeService) {}
  @Get('form')
  getForm(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order API Test</title>
      </head>
      <body>
        <h1>Order Time Validation</h1>
        <form id="orderForm">
        
          <label for="requestedDateTime">Requested DateTime ( YYYY-MM-DD HH:mm):</label>
          <input type="text" id="requestedDateTime" name="requestedDateTime" required />
          <br><br>
  
          <label for="restaurantOpen">Restaurant Open (HH:mm):</label>
          <input type="text" id="restaurantOpen" name="restaurantOpen" required  value="09:00" />
          <br><br>
  
          <label for="restaurantClose">Restaurant Close (HH:mm):</label>
          <input type="text" id="restaurantClose" name="restaurantClose" required  value="21:00" />
          <br><br>
  
          <label for="orderAcceptOpen">Order Accept Open (HH:mm):</label>
          <input type="text" id="orderAcceptOpen" name="orderAcceptOpen" required  value="09:30" />
          <br><br>
  
          <label for="orderAcceptClose">Order Accept Close (HH:mm):</label>
          <input type="text" id="orderAcceptClose" name="orderAcceptClose" required   value="20:00"/>
          <br><br>
  
          <label for="serviceDuration">Service Duration in Minutes (min-max) or (max-min):</label>
          <input type="text" id="serviceDuration" name="serviceDuration" required  value="60-75"/>
          <br><br>

          <label for="currentTime">Current Time (Optional, HH:mm): (enter to avoid the past time validation)</label>
          <input type="text" id="currentTime" name="currentTime" />
          <br><br>
  
          <button type="submit">Submit</button>
          <br><br>
        </form>
     <div>
        <ul> <h4>Response types:</h4>
        <li>(-3) Requested time being in the past - you can control it by setting a value in "currentTime"</li>
        <li>(-2) Outside restaurant operating hours</li>
        <li>(-1) Outside order acceptance hours</li>
        <li>(0) Outside acceptable range for minimum pickup or delivery period</li>
        <li>(positive value) the differance between now and requested time in minutes</li>
        </ul>
     </div>
  
        <script>
          // Helper function to get the current date and time in YYYY-MM-DD HH:mm format
          function getCurrentDateTime() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = '14';
            const minutes = '00';
            return \`\${year}-\${month}-\${day} \${hours}:\${minutes}\`;
          }
  
          // Set the current datetime value in the requestedDateTime input
          document.getElementById('requestedDateTime').value = getCurrentDateTime();
  
          document.getElementById('orderForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = {};
            formData.forEach((value, key) => {
              data[key] = value;
            });
  
            fetch('/order-time', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            })
              .then(response => response.json())
              .then(data => alert('response is: ' + JSON.stringify(data)))
              .catch(error => alert('Error: ' + error));
          });
        </script>
      </body>
      </html>
    `;
  }

  @Post()
  @ApiOrderTimeValidationOperation
  @ApiOrderTimeValidationBody
  @ApiOrderTimeValidationResponse
  @ApiOrderTimeValidationResponse400
  validateTime(@Body() data: OrderTimeValidationDto): { result: number } {
    const result = this.orderTimeService.validateRequestTime(data);
    return { result };
  }
}
