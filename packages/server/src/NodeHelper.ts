export const findStartNode = (workflow: any) => {

    let flowData = workflow;
    let stargingNode = flowData.nodes.find((node: { type: string; }) => node.type == 'start')

    return {
        startNode:stargingNode, defaultFunction: stargingNode.defaultFunction
    }
}

export const getNextNode = (workflow: any, outputPin: any) => {
    return {
        nextNode: '', nextNodeInputPin: []
    }

}

export const getInputPinConnectedWithStart = () => {

}
export const getfunctionName = (inputPins: any) => {

    return ''
}