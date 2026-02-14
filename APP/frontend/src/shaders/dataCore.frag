// Living Data Core - Fragment Shader
// Premium material with HDR and subtle glow

uniform vec3 uColorPrimary;
uniform vec3 uColorSecondary;
uniform float uTime;
uniform bool uIsDark;
uniform float uGlowIntensity;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

void main() {
    // Fresnel effect for edge glow
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 3.0);

    // Base color with gradient based on position
    float gradientFactor = (vPosition.y + 1.0) * 0.5;
    vec3 baseColor = mix(uColorPrimary, uColorSecondary, gradientFactor);

    // Add displacement-based highlight
    vec3 highlightColor = uIsDark ? vec3(0.0, 1.0, 1.0) : vec3(0.063, 0.725, 0.506);
    baseColor = mix(baseColor, highlightColor, vDisplacement * 0.4);

    // Fresnel rim lighting
    vec3 rimColor = uIsDark ? vec3(0.0, 1.0, 0.616) : vec3(0.063, 0.725, 0.506);
    vec3 finalColor = mix(baseColor, rimColor, fresnel * 0.6);

    // Subtle animated glow
    float pulse = sin(uTime * 1.5) * 0.5 + 0.5;
    float glow = fresnel * uGlowIntensity * (0.8 + pulse * 0.2);

    // Add glow to final color
    finalColor += rimColor * glow;

    // Tone mapping for HDR look
    finalColor = finalColor / (finalColor + vec3(1.0));
    finalColor = pow(finalColor, vec3(1.0 / 2.2)); // Gamma correction

    // Glass-like transparency on edges
    float alpha = 0.85 + fresnel * 0.15;

    gl_FragColor = vec4(finalColor, alpha);
}
