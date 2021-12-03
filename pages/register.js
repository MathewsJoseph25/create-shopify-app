import React from "react";
import { EmptyState, Layout, Page } from "@shopify/polaris";
import Link from "next/link";
import { AppStatus } from "../components/wrapper";

export default class register extends React.Component {
    static contextType = AppStatus;
    constructor(props) {
        super(props);
  
        this.state = {
          serial : null
        };
      }

      componentWillMount() {
        this.renderMyData();
    }

    renderMyData(){

    console.log("Sending Api Request");
    this.context.showLoadingBar();
    window.api.get("/shop").then((response) => response.json()).then((responseJson)=>{
        console.log(response.serial);
        this.setState({ serial : responseJson })
        this.context.hideLoadingBar();
    }) 
    render() {
        if (this.state.serial === null){            
            return <SerialRegistered />
    }
    return <SerialUnregistered />}
}