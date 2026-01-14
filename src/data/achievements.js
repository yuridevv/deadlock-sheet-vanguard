export const achievementsList = [
    { name: "Jogada Crítica", description: "Tire 14 ou mais em um teste.", icon: "🏆", trigger: "roll", condition: { gte: 14 } },
    { name: "Desastre Brutal", description: "Tire 0 em um teste.", icon: "🥀", trigger: "roll", condition: { lte: 0} },
    { name: "Sobreviventes", description: "Sobreviva a um encontro com um Hollow.", icon: "🎖️", trigger: "manual" },
    { name: "Intocável", description: "Saia de um combate sem tomar dano.", icon: "🎖️", trigger: "manual" },
    { name: "Despertar", description: "Desperte para a umbra.", icon: "🎖️", trigger: "manual" },
    { name: "O Arauto Mais Forte", description: "Dê o maior dano do combate.", icon: "🎖️", trigger: "manual" },
    { name: "Leroy Jenkins", description: "Estrague tudo em uma cena furtiva.", icon: "🥀", trigger: "manual" },
    { name: "Xeque-Mate", description: "Seja burro e nos surpreenda.", icon: "♟️", trigger: "manual" },
    { name: "É que eu sou burros", description: "Desastre em um teste de Intelecto.", icon: "🥀", trigger: "roll", condition: { lte: 1, attr: 'Intelecto' } },
    { name: "Oooito gramas de proteína", description: "Desastre em um teste de Físico.", icon: "🥀", trigger: "roll", condition: { lte: 1, attr: 'Fisico' } },
    { name: "Respondãos mes", description: "Desastre em um teste de Presença.", icon: "🥀", trigger: "roll", condition: { lte: 1, attr: 'Presenca' } },
    { name: "Deus abençoe", description: "Desastre em um teste de Vontade.", icon: "🥀", trigger: "roll", condition: { lte: 1, attr: 'Vontade' } },
    { name: "Recebems", description: "Desastre em um teste de Destreza.", icon: "🥀", trigger: "roll", condition: { lte: 1, attr: 'Destreza' } },
    { name: "Hentai girl master", description: "Desastre em um teste de Instinto.", icon: "🥀", trigger: "roll", condition: { lte: 1, attr: 'Instinto' } },
    { name: "Capitão redbull", description: "Seja digno (entregue pelo próprio).", icon: "🎖️", trigger: "manual" },
    { name: "Final guy", description: "Sobreviva a DFD.", icon: "🎖️", trigger: "manual" },
    { name: "Abençoado", description: "Sobreviva o DEADLOCK sem tomar dano.", icon: "🎖️", trigger: "manual" },
    { name: "Escolha errada", description: "Faça uma escolha brutalmente errada.", icon: "🥀", trigger: "manual" },
    { name: "À moda fagundes", description: "Mate um hollow.", icon: "🎖️", trigger: "manual" },
    { name: "The walking dead", description: "Sobreviva ao estado morrendo.", icon: "🎖️", trigger: "manual" }
];

// Transforma a lista em um objeto para fácil acesso, e adiciona o estado 'unlocked'
export const initialAchievementsState = () => {
    const state = {};
    achievementsList.forEach(ach => {
        state[ach.name] = {
            description: ach.description,
            unlocked: false,
            icon: ach.icon || '🎖️', // Ícone padrão é '🎖️'
            trigger: ach.trigger,
            condition: ach.condition
        };
    });
    return state;
};