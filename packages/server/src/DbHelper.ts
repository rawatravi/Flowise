import { getDataSource } from "./DataSource"
import { ChatFlow } from "./entity/ChatFlow"
import { ChatMessage } from "./entity/ChatMessage"
import { ChatSession } from "./entity/ChatSession"



export async function getCurrentWorkflow(workflowId: string) {
    // get current workflow by flow id
    const currentWorkfolw = await getDataSource()
        .getRepository(ChatFlow)
        .createQueryBuilder('cm')
        .where('chatflowid = :chatflowid', { workflowId })
        .getOne()
    return currentWorkfolw

}

export async function checkSessionStatus(sessionId: string) {
    // get current Session Status 
    const currentSessionStatus = await getDataSource()
        .getRepository(ChatSession)
        .createQueryBuilder('cm')
        .select('cm.id')
        .where('sessionId = :sessionId', { sessionId })
        .orderBy('cm.createdDate', 'ASC')
        .getOne()
    return currentSessionStatus
}

export async function updateSessionData(session:any,currentvariables:any, nextNode:string, nextNodeInputPin:any){

}