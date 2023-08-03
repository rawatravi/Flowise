

/* eslint-disable */
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Index } from 'typeorm'
import {  IChatSession, MessageType } from '../Interface'

@Entity()
export class ChatSession implements IChatSession {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Index()
    @Column()
    sessionId: string

 
    @Column()
    sessionStatus: string

    @Column()
    workflowId: string

    @Column()
    resumeFunction: string

    @Column({ type: 'text' })
    userVariables: string

    @CreateDateColumn()
    createdDate: Date
}
