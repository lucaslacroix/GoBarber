# Recuperação de senha

**RF** (Requisitos Funcionais)
É descrito o que estará presente dentro do módulo de recuperação de senha

[x] O usuário deve poder recuperar sua senha informando o seu e-mail;
[x] O usuário deve receber um e-mail com instruções de recuperação de senha;
[x] O usuário deve poder resetar sua senha;

**RNF** (Requisitos Não Funcionais)
Requisitos voltados para a parte técnica

[x] Utilizar Mailtrap para testar envios em ambiente de desenvolvimento;
[ ] Utilizar Amazon SES para envios em produção;
[ ] O envio de e-mails deve acontecer em segundo plano (background job);

**RN** (Regras de negócio)

[x] O link enviado por email para resetar senha, deve expirar em 2h;
[x] O usuário precisa confirmar a nova senha ao resetar sua senha;


# Atualização de perfil

**RF** (Requisitos Funcionais)

[x] O usuário deve poder atualizar seu nome, email e senha


**RN** (Regras de negócio)

[x] O usuário não pode alterar seu email para um email já utilizado;
[x] Para atualizar sua senha, o usuário deve informar a senha antiga;
[x] Para atualizar sua senha, o usuário deve confirmar a nova senha;

# Painel do prestador

**RF** (Requisitos Funcionais)

[ ] O usuário deve poder listar seus agendamentos de um dia específico;
[ ] O prestador deve receber uma notificação sempre que houver um novo agendamento;
[ ] O prestador deve poder visualizar as notificações não lidas;

**RNF** (Requisitos Não Funcionais)

[ ] Os agendamentos do prestador no dia devem ser armazenados em cache;
[ ] As notificações do prestador devem ser armazenadas no MongoDB;
[ ] As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io

**RN** (Regras de Negócio)

[ ] A notificação deve ter um status de lida ou não-lida para que o prestador possa poder controlar

# Agendamento de serviços

**RF** (Requisitos Funcionais)

[x] O usuário deve poder listar todos prestadores de serviços cadastrados;
[x] O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador;
[x] O usuário deve poder listar horarios disponíveis em um dia específico de um prestador;

**RNF** (Requisitos Não Funcionais)

[ ] A listagem de prestadores deve ser armazenada em cache;

**RN** (Regras de Negócio)

[x] Cada agendamento deve durar 1h exatamente;
[x] Os agendamentos devem estar disponíveis entre 8h às 18h (Primeiro às 8h, último às 17h);
[x] O usuário não pode agendar em um horário já ocupado;
[x] O usuário não pode agendar em um horário que já passou;
[x] O usuário não pode agendar serviços consigo mesmo;
