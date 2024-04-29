import prisma from './database';
import { Prisma } from '@prisma/client';

/**
 * Verify users credential and return the user info
 * @param patrolID 
 * @param emailInput 
 * @param passwordInput 
 * @returns 
 */
// async function getPatrolCredentials(patrolID: number, emailInput: string, passwordInput: string) {
//     try {
//         const patrol = await prisma.patrols.findUnique({
//             where: {
//                 email: emailInput,
//                 id: patrolID,
//                 password: passwordInput
//             }
//         })

//         if (patrol) {
//             return patrol
//         }

//         return null;

//     } catch (e: any) {
      
//         if (e instanceof Prisma.PrismaClientKnownRequestError) {
//             throw e.message
//         } else {
//             throw e
//         }
//     }
// }

// /**
//  * For testing only, also fetch user with email as credential
//  * @param patrolID 
//  * @returns
//  */
// async function testCredentials(emailInput: string) {
//     try {
//         const patrol = await prisma.patrols.findUnique({
//             where: {
//                 email: emailInput
//             }
//         })

//         if (patrol) {
//             return patrol;
//         }

//         return false;

//     } catch (e: any) {
//         if (e instanceof Prisma.PrismaClientKnownRequestError) {
//             throw e.message
//         } else {
//             throw e
//         }
//     }
// }


const patrolDb = {
    // getPatrolCredentials,
    // testCredentials,
}

export default patrolDb
