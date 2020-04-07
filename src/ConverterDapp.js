import React, { Component } from "react"
import { Navbar, NavbarBrand, Card, CardBody, Button, Container, Row, Col, Media, InputGroup } from 'reactstrap'
import NumberFormat from "react-number-format"
import { connect } from 'react-redux'
import { connectNetwork, from223to20, from20to223 } from './actions'
import { ERC20WrapperAddress, ERC223WrapperAddress, ERC20TokenDecimals, ERC223TokenDecimals } from './constants'

import { getEtherBalances, getTokenBalances } from '@mycrypto/eth-scan'
import { convertEthereumBalance, convertTokenBalance } from './utils/Web3Util'

import SaturnLogoImage from "./images/logo-light.png"
import InstallWalletImage from "./images/install-wallet.png"
import Saturn20Image from "./images/saturn-20.png"
import Saturn223Image from "./images/saturn-223.png"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'

const SATURN_WALLET_URL = "https://chrome.google.com/webstore/detail/saturn-wallet/nkddgncdjgjfcddamfgcmfnlhccnimig"

class ConverterDapp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ethereumBalance: 0,
      saturn223Balance: 0,
      saturn20Balance: 0,
      swapAmount: null,
      swapType: "from223to20",
      txHash: ""
    }

    this.toggleSwapType = this.toggleSwapType.bind(this)
  }

  componentWillMount() {
    this.props.connectNetwork()
    this.loadAccountBalances()

    this.fetchData = setInterval(this.loadAccountBalances.bind(this), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.fetchData)
  }

  async loadAccountBalances() {
    let web3 = this.props.web3
    let activeAccountAddress = this.props.activeAccountAddress

    if (web3 && activeAccountAddress) {
      let ethereumBalance  = await getEtherBalances(web3, [activeAccountAddress])
      let saturn223Balance = await getTokenBalances(web3, [activeAccountAddress], ERC223WrapperAddress)
      let saturn20Balance  = await getTokenBalances(web3, [activeAccountAddress], ERC20WrapperAddress)

      this.setState({ethereumBalance: convertEthereumBalance(web3, ethereumBalance, activeAccountAddress),
                     saturn223Balance: convertTokenBalance(web3, saturn223Balance, activeAccountAddress, ERC223WrapperAddress, ERC223TokenDecimals),
                     saturn20Balance: convertTokenBalance(web3, saturn20Balance, activeAccountAddress, ERC20WrapperAddress, ERC20TokenDecimals)})
    }
  }

  toggleSwapType() {
    this.setState({ swapType: (this.state.swapType === "from223to20" ? "from20to223" : "from223to20")})
  }

  async signTransaction() {
    let swapAmount = this.state.swapAmount
    let swapType = this.state.swapType
    let txHash

    if (swapAmount > 0) {
      if (swapType === "from223to20") {
        txHash = await this.props.from223to20(swapAmount)
      } else {
        txHash = await this.props.from20to223(swapAmount)
      }

      if (txHash) {
        this.setState({ txHash: txHash })
      }
    }
  }

  render() {
    let Saturn223Balance = `${Number(this.state.saturn223Balance).noExponents()} SATURN [ERC223]`
    let Saturn20Balance = `${Number(this.state.saturn20Balance).noExponents()} SATURN [ERC20]`

    return (
      <div>
        <Navbar style={{backgroundColor: "#0e1e3d"}}>
          <NavbarBrand href="/">
            <Media src={SaturnLogoImage} height={30} alt="Saturn Network Logo" className="d-inline-block align-top" />
          </NavbarBrand>
        </Navbar>

        <Container>
          <Row>
            <Col sm="12" md={{ size: 6, offset: 3 }} className="mt-5 text-center">
              <h2 style={{color: "#101a2d", fontWeight: 300}}>Saturn Tokens Converter</h2>
            </Col>
          </Row>

          <Row>
            <Col sm="12" md={{ size: 10, offset: 1 }} className="mt-5">
              { !this.props.isConnected && <a href={SATURN_WALLET_URL}>
                <Media src={InstallWalletImage} alt="Install Saturn Wallet" className="mx-auto d-block" />
              </a> }

              { this.props.isConnected &&
                <Card style={{backgroundColor: "#0e1e3d"}}>
                  <CardBody>
                    <Row>
                      <Col lg="5" md="12" className="text-center">
                        <span className="text-light font-bold">You Send</span>
                        <div style={{position: "relative"}}>
                          <InputGroup>
                            <NumberFormat
                              style={{width: "100%", backgroundColor: "rgba(230,239,251,.2)", color: "#fff",
                                      border: "1px solid #d2dde9", borderRadius: "4px", padding: "10px 15px",
                                      lineHeight: "20px", fontSize: "1.2em", textAlign: "right"}}
                              allowNegative={false}
                              decimalScale={ERC223TokenDecimals}
                              value={this.state.swapAmount}
                              onChange={event => { event.persist(); this.setState({swapAmount: event.target.value}); }} />
                          </InputGroup>

                          <div style={{ position: "absolute", left: "0", top: "9px", padding: "0 10px", borderRight: "1px solid #d2dde9" }}>
                            <Media src={this.state.swapType === "from223to20" ? Saturn223Image : Saturn20Image} height={20} width={20} />
                          </div>
                        </div>

                        <div className="text-left">
                          <small className="text-light">{this.state.swapType === "from223to20" ? Saturn223Balance : Saturn20Balance}</small><br/>
                          <small className="text-light">{this.state.ethereumBalance} ETH</small>
                        </div>
                      </Col>

                      <Col lg="2" className="d-none d-lg-block">
                        <div style={{marginTop: "35px"}} className="text-center">
                          <a href="" onClick={event => { event.preventDefault(); this.toggleSwapType() }} className="text-light"><FontAwesomeIcon icon={faExchangeAlt} size="lg" /></a>
                        </div>
                      </Col>

                      <Col md={{ size: 2, offset: 5 }} className="d-lg-none align-items-center justify-content-center">
                        <div className="text-center" style={{marginTop: "35px", marginBottom: "35px"}}>
                          <a href="" onClick={event => { event.preventDefault(); this.toggleSwapType() }} className="text-light"><FontAwesomeIcon icon={faExchangeAlt} size="lg" rotation={90} /></a>
                        </div>
                      </Col>

                      <Col lg="5" md="12" className="text-center">
                        <span className="text-light font-bold">You Get</span>
                        <div style={{position: "relative"}}>
                          <InputGroup>
                            <NumberFormat
                              style={{width: "100%", backgroundColor: "rgba(230,239,251,.2)", color: "#fff",
                                      border: "1px solid #d2dde9", borderRadius: "4px", padding: "10px 15px",
                                      lineHeight: "20px", fontSize: "1.2em", textAlign: "right"}}
                              allowNegative={false}
                              decimalScale={ERC223TokenDecimals}
                              value={this.state.swapAmount}
                              disabled />
                          </InputGroup>

                          <div style={{ position: "absolute", left: "0", top: "9px", padding: "0 10px", borderRight: "1px solid #d2dde9" }}>
                            <Media src={this.state.swapType === "from223to20" ? Saturn20Image : Saturn223Image} height={20} width={20} />
                          </div>
                        </div>

                        <div className="text-left">
                          <small className="text-light">{this.state.swapType === "from223to20" ? Saturn20Balance : Saturn223Balance}</small>
                        </div>
                      </Col>

                      <Col lg="12" className="text-center">
                        { this.state.txHash === "" && <Button color="success" disabled={!(this.state.swapAmount > 0)} onClick={ e => this.signTransaction() }>Swap Now</Button> }
                        { this.state.txHash !== "" && <a href={`http://etherscan.io/tx/${this.state.txHash}`} className="btn btn-info">View on Etherscan</a> }
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              }
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    activeAccountAddress: state.network.activeAccountAddress,
    isConnected: state.network.isConnected,
    web3: state.network.web3
  }
}

const mapActionCreators = {
  connectNetwork,
  from223to20,
  from20to223
}

export default connect(mapStateToProps, mapActionCreators)(ConverterDapp)
