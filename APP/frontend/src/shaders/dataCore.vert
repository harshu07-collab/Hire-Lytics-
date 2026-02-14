// Living Data Core - Vertex Shader
// Premium deformation shader for cursor interaction

uniform vec3 uMousePosition;
uniform float uMouseInfluence;
uniform float uTime;
uniform float uMouseVelocity;
uniform bool uMouseActive;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

// Smooth falloff function for natural deformation
float smoothFalloff(float distance, float radius) {
    float normalized = clamp(distance / radius, 0.0, 1.0);
    // Smooth hermite interpolation for organic feel
    return 1.0 - normalized * normalized * (3.0 - 2.0 * normalized);
}

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    vec3 newPosition = position;
    float displacement = 0.0;

    if (uMouseActive) {
        // Calculate distance from vertex to mouse position
        float dist = distance(position, uMousePosition);

        // Influence radius - larger for more dramatic effect
        float influenceRadius = 2.5;

        if (dist < influenceRadius) {
            // Calculate smooth falloff
            float influence = smoothFalloff(dist, influenceRadius);

            // Direction from mouse to vertex (repulsion)
            vec3 direction = normalize(position - uMousePosition);

            // Base displacement with velocity influence
            float baseDisplacement = influence * uMouseInfluence;
            float velocityBoost = uMouseVelocity * 0.3;
            displacement = baseDisplacement * (1.0 + velocityBoost);

            // Apply displacement along the direction
            newPosition += direction * displacement;

            // Add subtle perpendicular wave for organic feel
            vec3 perpendicular = cross(direction, vec3(0.0, 1.0, 0.0));
            newPosition += perpendicular * sin(dist * 3.0 - uTime * 2.0) * displacement * 0.15;
        }
    }

    // Subtle ambient breathing animation
    float breathe = sin(uTime * 0.8 + position.y * 2.0) * 0.02;
    newPosition += normal * breathe;

    vDisplacement = displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
