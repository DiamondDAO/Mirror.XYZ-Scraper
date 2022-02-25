# Mirror.xyz Data Pipeline

## Summary
This solution is built and configured to fetch all posts published on [Mirror.xyz](http://www.mirror.xyz).

When a post is published on Mirror that data is stored as a JSON file on a blockchain using the [Arweave](http://www.arweave.org) protocol for permanent data storage.

At the bottom of each Mirror post is a table like this:

| Field | Address |
|--|--|
| Arweave Tx | [BiSkFNbcQt5aI1Zr-I0E-DGjf-Qk44FSyJds036EiKU](https://viewblock.io/arweave/tx/BiSkFNbcQt5aI1Zr-I0E-DGjf-Qk44FSyJds036EiKU) |
| Ethereum Address | [0x97b9958faceC9ACB7ADb2Bb72a70172CB5a0Ea7C](https://etherscan.io/address/0x97b9958faceC9ACB7ADb2Bb72a70172CB5a0Ea7C) |
| Content Digest | 1ruXRuCFKY9PM7hzgVKECF9TlmXnjTTVaULpMy4iAGk |

- `Arweave Tx` refers to the transaction on [Arweave](https://viewblock.io/arweave/) that contains the data for this Mirror post
- `Ethereum Address` refers to the wallet address of the Mirror account that published the post 
- `Content Digest` refers to the id of this particular post (which also is used for the post url slug)

## How it works
First the program uses the [Arweave GraphQL endpoint](https://arweave.net/graphql) to collect all transactions containing data from the `MirrorXYZ` app.

Then each transaction is parsed for the `Content-Digest` value, which is then used to query the [Arweave API](http://www.arweave.net) using the `http://www.arweave.net/<Content-Digest ID>` request convention.

## GraphQL Response data

An example JSON response for a single post is below. The `id` field is passed to the [Arweave](http://www.arweave.net) API to get the Mirror post metadata.

```json
{
	"data": {
		"transactions": {
			"edges": [
				 {
				"cursor": "WyIyMDIyLTAyLTI1VDAwOjM2OjUzLjIyM1oiLDFd",
				"node": {
					"id": "BiSkFNbcQt5aI1Zr-I0E-DGjf-Qk44FSyJds036EiKU",
					"tags": [
					{
						"name": "Content-Type",
						"value": "application/json"
					},
					{
						"name": "App-Name",
						"value": "MirrorXYZ"
					},
					{
						"name": "Contributor",
						"value": "0x97b9958faceC9ACB7ADb2Bb72a70172CB5a0Ea7C"
					},
					{
						"name": "Content-Digest",
						"value": "sGTEiNpqL2hczBIOddOZc65nyV12kRKLkhIkyMWreuY"
					},
					{
						"name": "Original-Content-Digest",
						"value": "1ruXRuCFKY9PM7hzgVKECF9TlmXnjTTVaULpMy4iAGk"
					}
					]
				}
				}
			]
		}
	}
}
```

## Arweave API Response data

The JSON response is structured like this:

```json
{
	"content": {
		"body": "text from the post",
		"timestamp": <unix timestamp>,
		"title": "title of the post"
	},
	"digest": <unique identifier of post (versioned)>,
	"authorship": {
		"contributor": <wallet address of author>,
		"signingKey": <siging key of waller>,
		"signature": <wallet auth signature>,
		"signingKeySignature": <signing key signature address>,
		"signingKeyMessage": "message of signing key",
		"algorithm": {
			"name": "algorithm name",
			"hash": "hash type"
		}
	},
	"nft": {
		<details if the post is an nft>
	},
	"version": "MM-DD-YYYY date of Mirror smart contract",
	"originalDigest": <original unique identifier of post>
}
```

# Running the solution

First install all the Node.js packages: `npm install`

To gather all Mirror.xyz publications between two Arweave blocks and output to a JSON, run:
`node runPipeline <startBlock> <endBlock> <desiredPath>>.json`

For example: `node runPipeline.js 869641 869643 test.json`

# Additional details


See [`./'data exploration'/tables/`](https://github.com/nathanabram/Mirror.XYZ-Scraper/tree/master/data%20exploration/tables) for some views of the data snapshot.

To gather all Mirror.XYZ publications between two Arweave blocks and output to a JSON, run `node runPipeline <startBlock> <endBlock> '<desiredPath>.json'`.

In the process of gathering the data each article will be output to `./data` as a single JSON record before being pulled back into a single record at the end.
This `./data` file can be safely deleted once the data has been generated. 

Each record in the eventual array has the following structure: 

`{contributer:"0xBlahBlahBlah",
	publication: "My Blog,
	title: "Arweave is cool",
	body: "In this essay, ... ",
	timestamp: 1643322525,
	nft: {},
	transaction: "sdfeife343j29fa"
	}`
  
