#include <iostream>
#include <map>
#include <random>
#include <string> 
#include <vector>


// 1. Tierra de cultivo/Grano   4
// 2. Bosque/Leña               4
// 3. Colinas/Ladrillos         3
// 4. Montañas/Mineral-Roca     3
// 5. Pasto/Lana                4
// 6. Desierto                  1
const std::vector<int> Biome_terraform {4, 4, 3, 3, 4, 1};
enum Biome { Farmland, Forest, Hill, Mountain, Pasture, Desert };
struct Hex {
    int r;
    //int q;
    // s = -q-r
    Biome type;
};
std::ostream& operator<<(std::ostream& os, Biome b) {
    if (b == Farmland) {
        return os << "Farmland";
    } else if (b == Forest) {
        return os << "Forest";
    } else if (b == Hill) {
        return os << "Hill";
    } else if (b == Mountain) {
        return os << "Mountain";
    } else if (b == Pasture) {
        return os << "Pasture";
    } else if (b == Desert) {
        return os << "Desert";
    } else {
        return os << "WHAT THE FUCK IS GOING ON.";
    }
}

std::map<std::string, Hex> the_map;
std::random_device rd; // dispositivo de generación de números aleatorios
std::mt19937 gen(rd()); // generador de números aleatorios utilizando rd como semilla
std::uniform_int_distribution<> dis(0, 5);

void generate_map(int size) {
    auto terraform = Biome_terraform;
    for (int r = 0; r < size; r++) {
        for (int q = -(size-1); q < size - r; q++) {
            the_map[std::to_string(r) + std::to_string(q)] = {r, q, Farmland};
        }
    }
    for (int r = 0; r < size; r++) {
        for (int q = (-(size-1) + r); q < size; q++) {
            the_map[std::to_string(-r) + std::to_string(q)] = {-r, q, Farmland};
        }
    }

    for (auto& it : the_map) {
        auto& hex = it.second;
        int type = dis(gen);
        while (terraform[type] == 0) {
            type = dis(gen);
        }
        terraform[type]--;
        hex.type = (Biome)type;
    }
}


int main () {
    generate_map(3);
    for (auto& h : the_map) {
        auto hex = h.second;
        std::cout << "R: " << hex.r << ", Q: " << hex.q << ", Biome: " << hex.type << "\n";
    }
    std::cout << the_map.size() << "\n";
}

// g++ -std=c++11 test.cpp -o main && .\main.exe