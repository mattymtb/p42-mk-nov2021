# Pizza 42 

Sample react application using Auth0 as an identity provider.

Covers the following functionality:

- Gives new customers the option to sign up 
- Gives an existing customers the option to sign in with either email / password or a social identity provider such as Google.
- Requires that a customer have a verified email address before they can place a pizza order
- Customer does not need to have verified email in order to sign in
- The API endpoint servicing the API requires a valid token and specific scope. The API portion of the is exercise can be found here: [Pizza 42 MK API](https://github.com/mattymtb/p42-api-mk-nov2021).
- When an order is placed, the order is saved to the user's Auth0 profile
- When a user logs in, the order history is added to their ID token

