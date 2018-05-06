#version 410 core
in mat4 vViewMatrix;
in mat4 vProjectionMatrix;
in vec3 vRayDir;
in vec2 vScreenSize;
out vec4 outputColor;

float _MarchThreshold = 0.00001;
int _Steps = 500;
float _MarchRange = 1000.0;
float _Delta = 0.000001;
int Iterations = 5;
float Bailout = 2;
float Power = 8;
float focalLength = 1.0;
float maxRadiusSquared = 1.0;
float SCALE = 2.0;

vec4 scalevec = vec4(SCALE, SCALE, SCALE, abs(SCALE)) / maxRadiusSquared;
float C1 = abs(SCALE-1.0), C2 = pow(abs(SCALE), float(1-Iterations));

//float DE(vec3 pos) {
//	pos -= vec3(0, 1, 0);
//	vec3 z = pos;
//	float dr = 1.0;
//	float r = 0.0;
//	for (int i = 0; i < Iterations ; i++) {
//		r = length(z);
//		if (r>Bailout) break;
//
//		// convert to polar coordinates
//		float theta = acos(z.z/r);
//		float phi = atan(z.y,z.x);
//		dr =  pow( r, Power-1.0)*Power*dr + 1.0;
//
//		// scale and rotate the point
//		float zr = pow( r,Power);
//		theta = theta*Power;
//		phi = phi*Power;
//
//		// convert back to cartesian coordinates
//		z = zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
//		z+=pos;
//	}
//	return 0.5*log(r)*r/dr;
//}

float DE(vec3 z)
{
    vec4 p = vec4(z.xyz, 1.0), p0 = vec4(z.xyz, 1.0);  // p.w is knighty's DEfactor
    for (int i=0; i<Iterations; i++) {
        p.xyz = clamp(p.xyz, -1.0, 1.0) * 2.0 - p.xyz;  // box fold: min3, max3, mad3
        float r2 = dot(p.xyz, p.xyz);  // dp3
        p.xyzw *= clamp(max(maxRadiusSquared/r2, maxRadiusSquared), 0.0, 1.0);  // sphere fold: div1, max1.sat, mul4
        p.xyzw = p*scalevec + p0;  // mad4
    }
    return (length(p.xyz) - C1) / p.w - C2;
}

vec3 calculate_normal(vec3 pos) {
	return -normalize(vec3(
		DE(pos-vec3(_Delta,0,0)) - DE(pos+vec3(_Delta,0,0)),
		DE(pos-vec3(0,_Delta,0)) - DE(pos+vec3(0,_Delta,0)),
		DE(pos-vec3(0,0,_Delta)) - DE(pos+vec3(0,0,_Delta))
	));
}

void main()
{
	vec4 curPos = inverse(vViewMatrix) * vec4(0,0,0,1);

	float dist;
	for(int j = 0; j < _Steps; j++){
		dist = abs(DE(curPos.xyz));
		curPos.xyz += vRayDir*dist;
		if(dist < _MarchThreshold || dist > _MarchRange) break;
	}

	float lumi = clamp(dot(calculate_normal(curPos.xyz), normalize(vec3(-0.5, -0.5, -0.5))), 0, 1);
	if(dist < _MarchThreshold){
		//outputColor = vec4(calculate_normal(curPos.xyz), 1);
		outputColor = lumi*vec4(1);
	}else{
		outputColor = vec4(vRayDir.xyz, 1);
	}
}