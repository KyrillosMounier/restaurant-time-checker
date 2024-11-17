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
          <label for="orderType">Order Type (pickup or delivery):</label>
          <select id="orderType" name="orderType" required>
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
          </select>
          <br><br>

          <label for="requestedTime">Requested Time (HH:mm):</label>
          <input type="text" id="requestedTime" name="requestedTime" required value="13:00" />
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

          <label for="pickupMin">Pickup Min (Minutes):</label>
          <input type="number" id="pickupMin" name="pickupMin" required  value="15" />
          <br><br>

          <label for="pickupMax">Pickup Max (Minutes):</label>
          <input type="number" id="pickupMax" name="pickupMax" required  value="30" />
          <br><br>

          <label for="deliveryMin">Delivery Min (Minutes):</label>
          <input type="number" id="deliveryMin" name="deliveryMin" required  value="60"/>
          <br><br>

          <label for="deliveryMax">Delivery Max (Minutes):</label>
          <input type="number" id="deliveryMax" name="deliveryMax" required  value="75"/>
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
        <li><b>**Note**</b>for Requested time only we handle convert from 24h formate to 12h foramt for check if it's earlier than currentTime ,
        Adjust requestedTime  (possibly user meant PM)
        </li>

        </ul>
     </div>

        <script>
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
