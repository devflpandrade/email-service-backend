const { sendEmail } = require('../emailController');
const MailQueue = require('../../queue/MailQueue');

jest.mock('../../queue/MailQueue', () => ({
    add: jest.fn(), //Mock explícito do método add
}));

describe('sendEmail', () => {
    let mockRequest, mockReply;

    beforeEach(() => {
        mockRequest = {
            body: {
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe'
            }
        };
        mockReply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        //MailQueue.add.mockClear(); //Limpa apenas o método add
        jest.clearAllMocks();
        //limpa todos os mocks configurados no arquivo antes de cada teste. É mais abrangente e seguro se houver vários mocks no msm arquivo
    });


    //sucesso
    it('should send an email and return 200 on success', async () => {
        MailQueue.add.mockResolvedValue();

        await sendEmail(mockRequest, mockReply);

        expect(MailQueue.add).toHaveBeenCalledWith({
            to: 'test@example.com',
            from: process.env.EMAIL_FROM,
            subject: 'Assinatura Confirmada',
            text: expect.stringContaining('Olá John Doe, sua assinatura foi confirmada!')
  // expect.stringContaining é flexível para verificar partes específicas do texto gerado, 
  // anteriormente  o texto era validado literalmente, podendo causar falhas se o texto mudar levemente no código fonte

        });
//      expect(mockReply.code).toHaveBeenCalledWith(200); 
//      expect(mockReply.send).toHaveBeenCalled();
//  foco no conteudo principal da chamada, sem contar o numero de vezes que os metodos foram chamados

        expect(MailQueue.add).toHaveBeenCalledTimes(1);
        expect(mockReply.send).toHaveBeenCalledTimes(1);
// desta forma estou abordando o teste de forma mais detalhada, onde multiplas chamadas ao mesmo método são possíveis
    });

    //falha 
    it('should return 500 if MailQueue.add fails', async () => {
        MailQueue.add.mockRejectedValue(new Error('Queue Error')); // Simula falha

        await sendEmail(mockRequest, mockReply);

        expect(MailQueue.add).toHaveBeenCalled();
        expect(mockReply.code).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith('Internal Server Error');
    });
});


// teste original abaixo:


// const MailQueue = require('../../queue/MailQueue');
// const { sendEmail } = require('../emailController');

// jest.mock('../../queue/MailQueue');

// describe('sendEmail', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should send an email successfully and return 200', async () => {
//     const request = {
//       body: {
//         email: 'test@example.com',
//         firstName: 'John',
//         lastName: 'Doe',
//       },
//     };
//     const reply = {
//       code: jest.fn().mockReturnThis(),
//       send: jest.fn(),
//     };

//     await sendEmail(request, reply);

//     expect(MailQueue.add).toHaveBeenCalledTimes(1);
//     expect(MailQueue.add).toHaveBeenCalledWith({
//       to: 'test@example.com',
//       from: process.env.EMAIL_FROM,
//       subject: 'Assinatura Confirmada',
//       text: `
//         Olá John Doe, sua assinatura foi confirmada!
//         Para acessar seus recursos exclusivos você precisa basta clicar aqui.
//     `,
//     });
//     expect(reply.code).toHaveBeenCalledWith(200);
//     expect(reply.send).toHaveBeenCalledTimes(1);
//   });

//   it('should handle errors and return 500 status code', async () => {
//     const request = {
//       body: {
//         email: 'test@example.com',
//         firstName: 'John',
//         lastName: 'Doe',
//       },
//     };
//     const reply = {
//       code: jest.fn().mockReturnThis(),
//       send: jest.fn(),
//     };

//     MailQueue.add.mockRejectedValue(new Error('Some error'));

//     await sendEmail(request, reply);

//     expect(MailQueue.add).toHaveBeenCalledTimes(1);
//     expect(reply.code).toHaveBeenCalledWith(500);
//     expect(reply.send).toHaveBeenCalledWith('Internal Server Error');
//   });
// });
