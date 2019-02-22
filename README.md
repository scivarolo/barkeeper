# Barkeeper
Do you like to make cocktails at home, but struggle with knowing what to make because you never have all of the ingredients for that cocktail you've been craving? Barkeeper aims to solve this problem by keeping track of your favorite cocktail recipes and your bar inventory. The app will let you know which of your favorite cocktails you can make with what you have on hand. Missing a crucial ingredient? Add it to your shopping list, and you won't forget it next time you go shopping.

## Bar Inventory
Manage your bar inventory: Add products, and update quantities and amount left.

![Bar Inventory GIF](https://github.com/scivarolo/barkeeper/blob/master/bar-inventory.gif)

## Cocktails
Save your favorite recipes, see which cocktails can be made with your current inventory, add missing ingredients to your shopping list, and make cocktails. When you make a cocktail, the ingredients used are deducted from your inventory.

![Cocktails GIF](https://github.com/scivarolo/barkeeper/blob/master/cocktails.gif)

## Shopping List
Once an item is purchased, you can add the product to your inventory.

![Shopping list GIF](https://github.com/scivarolo/barkeeper/blob/master/shopping-list.gif)

## Tech Talk
Barkeeper is a front-end application built with React, utilizing SCSS and a few third-party packages: Bootstrap, Reactstrap, react-bootstrap-typeahead, and react-bs-notifier. All data is user-generated and stored in a database with a flat data structure. Data is served to the front-end by a Django REST API. Learn more about the API here: ![Barkeeper API](https://github.com/scivarolo/barkeeper-api)

### ERD

![Barkeeper ERD](https://github.com/scivarolo/barkeeper/blob/master/barkeeper-erd.png)

## Try It Out Locally

Clone the repo to your computer and run `npm install` in the directory<br>

When you're ready to start the server:
#### `npm start`

This will run the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
Data will be served from the main API hosted online.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
