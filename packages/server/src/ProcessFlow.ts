// //DB:

import { Request } from "express";
import { checkSessionStatus, getCurrentWorkflow, updateSessionData } from "./DbHelper";
import { IReactFlowObject } from "./Interface";
import { constructGraphs } from "./utils";
import { findStartNode, getInputPinConnectedWithStart, getNextNode, getfunctionName } from "./NodeHelper";


const processPrediction = async (req: Request) => {
    const workflowId = req.params.workflowId;
    const sessionId = req.params.sessionId;
    //Get Current Workflow Id
    const workflow = await getCurrentWorkflow(workflowId);
    //Check Current Session Status
    let session = await checkSessionStatus(sessionId);
    //////// Check DB table Format
    handleNode(workflow, session);
}

const handleNode = async (workflow: any, session: any) => {
    let nodeOutput;
    const flowData = workflow.flowData
    const parsedFlowData: IReactFlowObject = JSON.parse(flowData)
    const nodes = parsedFlowData.nodes
    const edges = parsedFlowData.edges
    if (session.status == 'NotStarted') {
        /*** Get Starting Nodes with Non-Directed Graph ***/
        let { startNode, defaultFunction } = findStartNode(flowData);
        nodeOutput = await runNode(startNode, defaultFunction);
    }
    else if (session.status == 'WaitingUserInput') {
        // Find the function that has to be called
        const functoevaluate = session.resumefunction;
        nodeOutput = runNode(session.currentNode, functoevaluate);
    }
    else if (session.status === "WaitingforAction") { }
    if (nodeOutput.outputpin) {
        let { nextNode, nextNodeInputPin } = getNextNode(workflow, nodeOutput.outputPin);
        let sessiondata = updateSessionData(session, nodeOutput.currentvariables, nextNode, nextNodeInputPin);
        handleNode(workflow, sessiondata);
    }
}


const runNode = (node: any, action: string) => {
    if (!action) {
        //In case not to use action input, then
        let inputPins = getInputPinConnectedWithStart();
        let getactionName = getfunctionName(inputPins);
    }

    //Get the node
    const nodeInstanceFilePath = node.nodePath
    const nodeModule = await import(nodeInstanceFilePath)
    const nodeInstance = new nodeModule.nodeClass()
    // let nodeobj = getNodeObject(node);
    //Check the action
    let output = nodeInstance[action](currentvariables, engineobj);
    return output;
}



/*
// Session Table:

// SessionId | SessionStatus    | WorkflowId  | ResumeFunction        | UserVaraibles
// 123123    | waitingUserInput |  123123     | questionanswered      | {question: "What is your name?"}


// function ProcessPrediction = async() => {

//     const workflowId = req.params.workflowId;
//     const sessionId = req.params.sessionId;

//     //Get Current Workflow Id
//     const workflow = await GetCurrentWorkflow(workflowId);

//     //Check Current Session Status
//     let session = await CheckSessionStatus(sessionId);
// //////// Check DB table Format
//     handleNode(workflow, session);

// }

// handleNode(workflow, session){
//     if (session.status == 'NotStarted') {
//         { startnode: string, defaultfunction } = findStartNode(workflow);

//         let nodeoutput = await runNode(startnode, defaultfunction);
//     }
//     else if (session.status == 'WaitingUserInput') {
//         // Find the function that has to be called
//         const functoevaluate = session.resumefunction;
//         let nodeoutput = runNode(sesssion.currentNode, functoevaluate);
//     }
//     else if (session.status === "WaitingforAction") { }



//     if (nodeoutput.outputpin) {
//         let { nextnode, nextnodeinputpin } = getnextnode(workflow, nodeoutput.outputpin);
//         let sessiondata = updateSessionData(session, nodeoutput.currentvariables, nextnode, nextnodeinputpin);
//         handleNode(workflow, sessiondata);
//     }
// }
// void runNode(node : string, action){

//     if (!action) {
//         //In case not to use action input, then
//         inputpins = GetInputPinConnectedWithStart();
//         getactionName = GetfunctionName(inputpins);
//     }

//     //Get the node
//     nodeobj = getNodeObject(node);
//     //Check the action
//     let output = nodeobj[action](currentvariables, engineobj);
//     return output;

// }

/

