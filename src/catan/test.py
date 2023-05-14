import random as rand



def sum(arr, end):
    res = 0
    for i in range(0, end):
        res += arr[i]
    return res

ndevelop_cards = 25

develop_cards_names = ['Caballero', 'Carreteras', 'Descubrimiento', 'Monopolio', 'Biblioteca', 'Capilla', 'Gran Salon', 'Mercado', 'Universidad']
develop_cards_quant = [14, 2, 2, 2, 1, 1, 1, 1, 1]
develop_cards_probs = [x/ndevelop_cards for x in develop_cards_quant]

print(develop_cards_probs, sum(develop_cards_probs, 1))

shuffled_deck = []
while (ndevelop_cards > 0):
    selected_card = rand.uniform(0,1)
    for i in range(0, len(develop_cards_names)):
        if (develop_cards_quant[i] > 0 and selected_card < sum(develop_cards_probs, i+1)):
            develop_cards_quant[i] -= 1
            shuffled_deck.append(develop_cards_names[i])
            ndevelop_cards -= 1
            print("Cards left: ", ndevelop_cards)

print("Deck: ", shuffled_deck)


#function create_development_deck() {
#
#    let new_deck   = Object.values(develop_cards_shuffle)
#    let cards_left = ndevelop_cards
#
#    let shuffled_deck = []
#    while (cards_left > 0) {
#        let selected_card = Math.random()
#        if (new_deck['Caballero'] > 0 && selected_card < sum(develop_cards_probs, 1)) {
#            new_deck['Caballero']--
#            shuffled_deck.push('Caballero')
#            cards_left--
#        } else if (new_deck['Carreteras'] > 0 && selected_card < sum(develop_cards_probs, 2)) {
#            new_deck['Carreteras']
#            shuffled_deck.push('Carreteras')
#            cards_left--
#        } else if (new_deck['Descubrimiento'] > 0 && selected_card < sum(develop_cards_probs, 3)) {
#            new_deck['Descubrimiento']
#            shuffled_deck.push('Descubrimiento')
#            cards_left--
#        } else if (new_deck['Monopolio'] > 0 && selected_card < sum(develop_cards_probs, 4)) {
#            new_deck['Monopolio']
#            shuffled_deck.push('Monopolio')
#            cards_left--
#        } else if (new_deck['Biblioteca'] > 0 && selected_card < sum(develop_cards_probs, 5)) {
#            new_deck['Biblioteca']
#            shuffled_deck.push('Biblioteca')
#            cards_left--
#        } else if (new_deck['Capilla'] > 0 && selected_card < sum(develop_cards_probs, 6)) {
#            new_deck['Capilla']
#            shuffled_deck.push('Capilla')
#            cards_left--
#        } else if (new_deck['Gran Salon'] > 0 && selected_card < sum(develop_cards_probs, 7)) {
#            new_deck['Gran Salon']
#            shuffled_deck.push('Gran Salon')
#            cards_left--
#        } else if (new_deck['Mercado'] > 0 && selected_card < sum(develop_cards_probs, 8)) {
#            new_deck['Mercado']
#            shuffled_deck.push('Mercado')
#            cards_left--
#        } else if (new_deck['Universidad'] > 0 && selected_card < sum(develop_cards_probs, 9)) {
#            new_deck['Universidad']
#            shuffled_deck.push('Universidad')
#            cards_left--
#        }
#    }
#    return shuffled_deck
#}