# ERC20 token wrapper protocol for ERC223 tokens

Built with [Saturn Dapp Dev Kit](https://www.saturn.network/blog/ethereum-dapp-development-kit/)!

![audited by saturn](https://www.saturn.network/blog/content/images/2020/02/smart-contract-audited-etc-odssey-1.png)

## What is this for?

ERC223 is a [token standard](https://www.saturn.network/blog/advantages-of-erc223-tokens/) that fixes some of the popular ERC20's shortcomings. Unfortunately this standard has failed to get bread a adoption and people, and most importantly the #defi ecosystem, are rallying around the ERC20 standard.

This wrapper allows communities to create a ERC20 token that can be used anywhere, backed by the original ERC223 token's value. For example, check out [Saturn20 token on etherscan](https://etherscan.io/token/0xaf350211414c5dc176421ea05423f0cc494261fb) that is backed by [saturn tokens](https://www.saturn.network/blog/benefit-of-saturn-tokens/).

If you're interested in a wrapper the other way around, check out [erc20 -> erc223 upgrade protocol](https://www.saturn.network/blog/erc20-erc223-upgrade-path/).

## How to build and test the smart contracts

1. Ensure you have node.js, git and yarn installed.
3. Download this repository, open the folder in terminal and run

```sh
yarn
yarn compile
yarn migrate
yarn coverage
```

You can then visually expect test coverage by viewing `coverage/index.html` in your web browser.

## To deploy final contract on ETH mainnet

First, do the `How to build and test the smart contracts` step. Then, edit `index.js` file so it
has your ERC223 token address and has the right name and symbol for your wrapped token. Then, run

```sh
yarn sol-compiler
node index.js
```

This will prompt you to enter a private key or a 12-word-mnemonic that will be used to deploy the ERC20 Wrapper for your token.

## How to customize and tweak frontend?

```sh
yarn frontend:start
```

The frontend is built using Facebook's excellent [create-react-app](https://create-react-app.dev/).

Minimum customization that you would require is to modify `src/constants.js` and enter correct addresses for your ERC223 token and your deployed ERC20 Wrapper.

If you know react and javascript, you can fully customize the UI located in the `src` folder.

## How to create production build of the frontend?

```sh
yarn frontend:build
```

## How to deploy the frontend on Github Pages

Github pages is a free hosting solution for open source repositories. Dapps like ERC20Wrapper can take advantage of this fantastic opportunity.

First, create the production frontend build. Then,

Just follow [this incredible guide](https://dev.to/yuribenjamin/how-to-deploy-react-app-in-github-pages-2a1f) and you'll have the wrapper/unwrapper dapp published in no time!

The `package.json` file in this repository already contains all the necessary dependencies and scripts. Simply modify the name, author, homepage, configure your github remote and run `yarn deploy`.
