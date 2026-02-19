import pygame
import random
import sys

# Constantes del juego
WIDTH = 640
HEIGHT = 480
BLOCK_SIZE = 20
FPS = 10

# Colores
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)

class Snake:
    """Clase que representa la serpiente."""
    def __init__(self):
        self.body = [[WIDTH // 2, HEIGHT // 2]]
        self.direction = [0, -BLOCK_SIZE]

    def move(self):
        """Mueve la serpiente en la dirección actual."""
        head = [self.body[0][0] + self.direction[0], self.body[0][1] + self.direction[1]]
        self.body.insert(0, head)
        self.body.pop()

    def grow(self):
        """Hace crecer la serpiente agregando un segmento."""
        tail = self.body[-1]
        self.body.append(tail)

    def change_direction(self, new_dir):
        """Cambia la dirección de la serpiente, evitando reversas inmediatas."""
        if new_dir != [-self.direction[0], -self.direction[1]]:
            self.direction = new_dir

    def check_collision(self):
        """Verifica colisiones con paredes o consigo misma."""
        head = self.body[0]
        # Colisión con paredes
        if head[0] < 0 or head[0] >= WIDTH or head[1] < 0 or head[1] >= HEIGHT:
            return True
        # Colisión consigo misma
        for segment in self.body[1:]:
            if head == segment:
                return True
        return False

class Food:
    """Clase que representa la comida."""
    def __init__(self):
        self.position = self.random_position()

    def random_position(self):
        """Genera una posición aleatoria para la comida."""
        x = random.randint(0, (WIDTH // BLOCK_SIZE) - 1) * BLOCK_SIZE
        y = random.randint(0, (HEIGHT // BLOCK_SIZE) - 1) * BLOCK_SIZE
        return [x, y]

    def respawn(self, snake_body):
        """Reaparece la comida en una posición válida."""
        self.position = self.random_position()
        while self.position in snake_body:
            self.position = self.random_position()

class Game:
    """Clase principal que maneja la lógica del juego."""
    def __init__(self):
        pygame.init()
        # Para Pyodide, usar display con flags para canvas
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption("Snake Game")
        self.clock = pygame.time.Clock()
        self.snake = Snake()
        self.food = Food()
        self.score = 0
        self.level = 1
        self.speed = FPS
        self.high_score = 0  # En navegador, usar localStorage vía JS
        self.running = True
        # Sonidos opcionales
        self.eat_sound = None
        try:
            pygame.mixer.init()
        except:
            pass

    def run(self):
        """Bucle principal del juego."""
        while self.running:
            self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(self.speed)
        pygame.quit()

    def handle_events(self):
        """Maneja eventos de entrada."""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP:
                    self.snake.change_direction([0, -BLOCK_SIZE])
                elif event.key == pygame.K_DOWN:
                    self.snake.change_direction([0, BLOCK_SIZE])
                elif event.key == pygame.K_LEFT:
                    self.snake.change_direction([-BLOCK_SIZE, 0])
                elif event.key == pygame.K_RIGHT:
                    self.snake.change_direction([BLOCK_SIZE, 0])

    def update(self):
        """Actualiza el estado del juego."""
        self.snake.move()
        if self.snake.check_collision():
            if self.score > self.high_score:
                self.high_score = self.score
                # Guardar en localStorage si está disponible
                try:
                    import js
                    js.localStorage.setItem('snake_high_score', str(self.high_score))
                except:
                    pass
            self.running = False
        if self.snake.body[0] == self.food.position:
            self.snake.grow()
            self.food.respawn(self.snake.body)
            self.score += 10
            if self.score % 50 == 0:
                self.level += 1
                self.speed += 2
            if self.eat_sound:
                self.eat_sound.play()

    def draw(self):
        """Dibuja el juego en la pantalla."""
        self.screen.fill(BLACK)
        # Dibujar serpiente
        for segment in self.snake.body:
            pygame.draw.rect(self.screen, GREEN, (segment[0], segment[1], BLOCK_SIZE, BLOCK_SIZE))
        # Dibujar comida
        pygame.draw.rect(self.screen, RED, (self.food.position[0], self.food.position[1], BLOCK_SIZE, BLOCK_SIZE))
        # Dibujar texto
        font = pygame.font.Font(None, 36)
        score_text = font.render(f"Score: {self.score}", True, WHITE)
        level_text = font.render(f"Level: {self.level}", True, WHITE)
        high_score_text = font.render(f"High Score: {self.high_score}", True, WHITE)
        self.screen.blit(score_text, (10, 10))
        self.screen.blit(level_text, (10, 50))
        self.screen.blit(high_score_text, (10, 90))
        pygame.display.flip()

# Para ejecución en Pyodide
def main():
    game = Game()
    game.run()

if __name__ == "__main__":
    main()