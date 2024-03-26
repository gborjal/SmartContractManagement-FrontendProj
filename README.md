For this project, create a simple contract with 2-3 functions. Then show the values of those functions in frontend of the application. using the SCM-Starter repository from https://github.com/MetacrafterChris/ as template.

What's different from the template?

In the smart contract Assessment,

	Variables added to  are passcode and passCodeCount

	Modified constructor to take balance and default passcode

	Modifiers IsOwner and PassCodePass

	event PassCodeChange

	deposit and withdraw functions have modifiers and an additional parameter _passCode

	addition of changePassCode for changing of passcode, as well as, functions for getting passcode and passcodeChangeCount
In the index.js,

	added state variables passcode and passCodeCount

	getters and setters for the additional variables

	modified deposit and withdraw function

	added changePassCode

	added input fields and button for the added functionalities

In the deploy.js,

	added const variable initPassCode

	modified deploy function to take two parameters, namely the balance and the default passcode

How to run:

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/


