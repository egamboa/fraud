# Fraud System

An API that implements custom rules for the business that caught suspect behaviors from user activity.

## Payment

>https://us-central1-ls-fraud.cloudfunctions.net/payment

* 1 membership will be flag as suspect if has more than 3 payment attempts.
    * { membId: 12345, paymentAttempts: 3 } -> flagged
* 1 new membership cannot be pay more than 5 times in 48 hours.
    * { membId: 12345, paymentAttempts: 5 } -> blocked
* CC cannot be used from different locations(timezones/countries) within 24 hours.
    * { last4_cc_number: 4444, locations: [ NY, NJ, Bangladesh], started_date: 1594052583(Epoch Time)  } -> blocked
* CC cannot pay memberships from different IP address within 4 hours.
    * { last4_cc_number: 4444, IP: 128.0.0.1, started_date: 1594052583(Epoch Time)  } -> blocked
* If the user tries purchase at low traffic hours we introduce friction.
    * { membId: 1235, last4_cc_number: 4444, IP: 128.0.0.1, started_date: 1594052583(3am)  } -> friction
* If the user fails to enter the CVV more than 3 times it adds friction.
    * { membId: 1235, last4_cc_number: 4444, cvv: 3, IP: 128.0.0.1, started_date: 1594052583(3am)  } -> friction

 
## Payment Activity
https://us-central1-ls-fraud.cloudfunctions.net/payment

    * Request
    ```json
    {
        "paymentAttempts": "5",
        "started_date": 1594095144
    }

    * Response
    ```json

    [
        {
            "type": "fouledOut",
            "params": {
                "message": "blocked!"
            }
        },
        {
            "type": "friction",
            "params": {
                "message": "not common buying hours!"
            }
        }
    ]

    * Request
    ```json
    {
      "paymentAttempts": "2",
      "started_date": 1594081593
    }

    * Response
    ```json

    []

## User Activity

>https://us-central1-ls-fraud.cloudfunctions.net/userActivity

* Flag as suspect if a login occurs outside of the membership user's location.

    * Request

     ```json
     {
        "membId": 12345,
        "region": "OK",
        "city": "Ada",
        "attempts": 1,
        "attempt_region": "FL",
        "attempt_city": "Tampa"
    }
    ```
    * Response

    ```json
    [
        {
            "type": "suspect_activity",
            "params": {
                "message": "login occurs outside of the membership user's location!"
            }
        }
    ]
    ```
* If the user fails to login more than 2 times it adds friction.
    * Request

    ```json
     {
        "membId": 12345,
        "region": "OK",
        "city": "Ada",
        "attempts": 3,
        "attempt_region": "OK",
        "attempt_city": "Ada"
    }
    ```

    * Response

    ```json
    [
        {
            "type": "friction",
            "params": {
                "message": "multiple login attempts"
            }
        }
    ]
    ```

### Error Types
Type | Description
------------ | -------------
friction | It could be a bot so we can add a Captcha.
suspect_activity | We can notify the user about the suspect activity.
access_blocked | We can block the request.

### Tech:

Node JS v10

[json-rules-engine](https://github.com/CacheControl/json-rules-engine)

Hosting: Firebase.
