var scene, camera, renderer, material;
var mesh, leftside_mesh, rightside_mesh;
var start_time, animation_time;
var animating, movingForward, movingBackward;
var pageTextures;
var angle, speed, currentPage;

init();

function init() {
    animating = false;
    movingForward = false;
    movingBackward = false;
    currentPage = 0;
    reset();

    pageTextures = [];
    const loader = new THREE.TextureLoader();

    const pngFiles = [
        '1.png',
        '1-1.png',
        '2.png',
        '2-1.png',
        '3.png',
        '3-1.png',
        '4.png',
        '4-1.png',
        '5.png',
        '5-1.png',
        '6.png',
        '6-1.png',
        '7.png',
        '7-1.png',
        '8.png',
        '8-1.png',
        '9.png',
        '9-1.png',
        '10.png',
        '10-1.png',
        '11.png',
        '11-1.png',
        '12.png',
        '12-1.png',
    ];

    pngFiles.forEach((file) => {
        loader.load('assets/zine/' + file, (texture) => {
            pageTextures.push(texture);
        });
    });

    scene = new THREE.Scene();

    const canvas = document.getElementById("c");

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 60, 40);
    camera.lookAt(scene.position);
    camera.updateProjectionMatrix();

    material = new THREE.MeshPhongMaterial({
        color: 0xF9EFD6,
        transparent: false,
        side: THREE.DoubleSide
    });

    mesh = new THREE.Mesh(getPageGeometry(angle), material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    leftside_mesh = new THREE.Mesh(getPageGeometry(187), material);
    leftside_mesh.castShadow = true;
    leftside_mesh.receiveShadow = true;
    scene.add(leftside_mesh);

    rightside_mesh = new THREE.Mesh(getPageGeometry(-7), material);
    rightside_mesh.castShadow = true;
    rightside_mesh.receiveShadow = true;
    scene.add(rightside_mesh);

    light1 = new THREE.DirectionalLight(0xFFFFFF, 0.65);
    light1.position.set(-10, 25, 10);
    light1.target.position.set(0, 0, 0);

    light1.castShadow = true;
    light1.shadow.bias = -0.002;
    light1.shadow.camera.top = 40;
    light1.shadow.camera.bottom = -20;
    light1.shadow.camera.left = -40;
    light1.shadow.camera.right = 40;
    light1.shadow.camera.near = 1;
    light1.shadow.camera.far = 60;
    light1.shadow.mapSize.width = 2048;
    light1.shadow.mapSize.height = 2048;

    scene.add(light1);
    scene.add(light1.target);

    light2 = new THREE.AmbientLight(0xFFFFFF, 0.3);
    scene.add(light2);

    light3 = new THREE.DirectionalLight(0xFFFFFF, 0.05);
    light3.position.set(20, 25, -20);
    light3.target.position.set(0, 0, 0);

    light3.castShadow = true;
    light3.shadow.bias = -0.002;
    light3.shadow.camera.top = 40;
    light3.shadow.camera.bottom = -20;
    light3.shadow.camera.left = -40;
    light3.shadow.camera.right = 40;
    light3.shadow.camera.near = 1;
    light3.shadow.camera.far = 60;
    light3.shadow.mapSize.width = 2048;
    light3.shadow.mapSize.height = 2048;

    scene.add(light3);
    scene.add(light3.target);

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', onWindowResize);

    requestAnimationFrame(render);
}

function loadTextures(pngFiles, callback) {
    const loader = new THREE.TextureLoader();
    let loadedCount = 0;

    pngFiles.forEach((file, index) => {
        loader.load(
            'assets/zine/' + file,
            (texture) => {
                fitTextureToPage(texture); // Fit texture to page
                console.log(`Loaded texture ${index}:`, texture);
                pageTextures[index] = texture; // Store texture in correct order
                loadedCount++;
                if (loadedCount === pngFiles.length) {
                    console.log("All textures loaded:", pageTextures);
                    callback(); // All textures loaded
                }
            },
            undefined,
            (error) => {
                console.error("Failed to load texture:", file, error);
            }
        );
    });
}

function fitTextureToPage(texture) {
    texture.wrapS = THREE.ClampToEdgeWrapping; // Disable repetition on the horizontal axis
    texture.wrapT = THREE.ClampToEdgeWrapping; // Disable repetition on the vertical axis

    const pageWidth = 22; // Match page_width in getPageGeometry
    const pageHeight = 30; // Match page_length in getPageGeometry

    const imageAspectRatio = texture.image.width / texture.image.height;
    const pageAspectRatio = pageWidth / pageHeight;

    // Adjust scale factor to shrink the texture without moving it
    const scaleFactor = 1.3; // Scale texture

    if (imageAspectRatio > pageAspectRatio) {
        // Texture is wider than the page, scale height to fit and reduce size
        texture.repeat.set(
            scaleFactor,
            scaleFactor * (pageAspectRatio / imageAspectRatio)
        );
        texture.offset.set(
            0.07, // Keep close to the edge, adjust as needed
            (1.2 - texture.repeat.y) / 2
        );
    } else {
        // Texture is taller than the page, scale width to fit and reduce size
        texture.repeat.set(
            scaleFactor * (imageAspectRatio / pageAspectRatio),
            scaleFactor
        );
        texture.offset.set(
            (1.2 - texture.repeat.x) / 2,
            0.02 // Keep close to the edge, adjust as needed
        );
    }

    // Ensure the texture is correctly oriented
    texture.rotation = Math.PI; // Rotate the texture by 180 degrees
    texture.center.set(0.5, 0.5); // Pivot rotation around the center of the texture
    return texture;
}

function updatePageTexture(currentPage) {
    if (currentPage < 0 || currentPage >= pageTextures.length / 2) {
        console.warn("Invalid page index:", currentPage);
        return;
    }

    // Left page texture (odd pages)
    const leftTexture = pageTextures[currentPage * 2];
    const leftMaterial = getPageMaterial(leftTexture);
    if (leftside_mesh.material) leftside_mesh.material.dispose();
    leftside_mesh.material = leftMaterial;

    // Right page texture (even pages)
    const rightTexture = pageTextures[currentPage * 2 + 1];
    const rightMaterial = getPageMaterial(rightTexture);
    if (rightside_mesh.material) rightside_mesh.material.dispose();
    rightside_mesh.material = rightMaterial;

    renderer.render(scene, camera);
}

function getPageMaterial(texture) {
    return new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
    });
}

function stop() {
    animating = false;
}

function play() {
    animating = true;
    requestAnimationFrame(render);
}

function reset() {
    start_time = -1;
    animation_time = -1;
    angle = -7;
    speed = 0.09;
}

function getPageGeometry(angle_in_degrees) {
    const geometry = new THREE.BufferGeometry();

    const indices = [];
    const vertices = [];
    const normals = [];
    const uvs = []; // UV coordinates for texture mapping

    const page_length = 30; // Length of the page
    const page_width = 22; // Width of the page
    const angle_in_radians = (angle_in_degrees * Math.PI) / 180;
    const max_height = 3; // Maximum curve height

    const direction = angle_in_degrees > 90 ? -1 : 1;
    const length_segment_count = 10; // Number of segments along the length
    const length_segment_size = page_length / length_segment_count;

    // Calculate total arc length of the curve
    const length_curved_part =
        direction * max_height * (Math.PI / 2 - angle_in_radians);
    const arc_length = Math.abs(length_curved_part);
    const flat_length = page_width - arc_length;

    const curved_part_segment_count = 25;
    const curved_part_segment_size = length_curved_part / curved_part_segment_count;

    let x, y, z, l, c, s;

    // Generate curved part geometry
    for (let i = 0; i <= curved_part_segment_count; i++) {
        l = (i * curved_part_segment_size) / max_height;
        c = Math.cos(l);
        s = Math.sin(l);
        x = direction * max_height * (1 - c);
        y = max_height * s;

        for (let j = 0; j <= length_segment_count; j++) {
            z = j * length_segment_size - page_length / 2;

            vertices.push(x, y, z);
            normals.push(-c, s * direction, 0);

            // Proportional UV mapping for the curved part
            const u = (i / curved_part_segment_count) * (arc_length / page_width);
            const v = j / length_segment_count;
            uvs.push(u, v);
        }
    }

    // Generate flat part geometry
    const x_start = x;
    const y_start = y;

    const flat_part_segment_count = 5;
    const flat_part_segment_size = flat_length / flat_part_segment_count;

    for (let i = 1; i <= flat_part_segment_count; i++) {
        l = i * flat_part_segment_size;
        x = x_start + l * s * direction;
        y = y_start + l * c;

        for (let j = 0; j <= length_segment_count; j++) {
            z = j * length_segment_size - page_length / 2;

            vertices.push(x, y, z);
            normals.push(-c, s * direction, 0);

            // Proportional UV mapping for the flat part
            const u =
                (arc_length / page_width) +
                (i / flat_part_segment_count) * (flat_length / page_width);
            const v = j / length_segment_count;
            uvs.push(u, v);
        }
    }

    // Generate indices (data for the element array buffer)
    const width_segment_count =
        curved_part_segment_count + flat_part_segment_count;
    for (let i = 0; i < width_segment_count; i++) {
        for (let j = 0; j < length_segment_count; j++) {
            const a = i * (length_segment_count + 1) + (j + 1);
            const b = i * (length_segment_count + 1) + j;
            const c = (i + 1) * (length_segment_count + 1) + j;
            const d = (i + 1) * (length_segment_count + 1) + (j + 1);

            // Generate two faces (triangles) per iteration
            indices.push(a, d, b); // Face one
            indices.push(b, d, c); // Face two
        }
    }

    geometry.setIndex(indices);
    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometry.setAttribute(
        "normal",
        new THREE.Float32BufferAttribute(normals, 3)
    );
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2)); // Add UVs

    return geometry;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animateTurnPage(targetAngle, callback) {
    const animationDuration = 1000; // Duration in ms
    const startAngle = angle; // Starting angle of the animation
    const startTime = performance.now(); // Timestamp when the animation starts
    animating = true; // Lock animation state

    function step() {
        const elapsedTime = performance.now() - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1); // Clamp progress to 1

        // Interpolate the angle
        angle = startAngle + (targetAngle - startAngle) * progress;

        // Update geometry and apply textures dynamically
        updatePageGeometry();
        applyPageTexturesDuringAnimation(progress);

        if (progress < 1) {
            requestAnimationFrame(step); // Continue the animation
        } else {
            // Reset animation state
            animating = false;
            angle = targetAngle; // Ensure the angle snaps to the target
            updatePageGeometry(); // Final geometry update
            if (callback) callback(); // Trigger callback after the animation completes
        }
    }

    requestAnimationFrame(step); // Start the animation
}

function applyPageTexturesDuringAnimation(progress) {
    const textureIndex = Math.floor(currentPage * 2); // Base texture index
    const nextTextureIndex = Math.min(textureIndex + 2, pageTextures.length - 1); // Ensure within bounds

    // Dynamically switch the texture based on animation progress
    const turningPageTexture = progress < 0.5
        ? pageTextures[textureIndex + 1]
        : pageTextures[nextTextureIndex];

    // Apply the texture to the turning page
    const turningPageMaterial = getPageMaterial(turningPageTexture);
    if (mesh.material) mesh.material.dispose();
    mesh.material = turningPageMaterial;

    renderer.render(scene, camera); // Re-render the scene with updated textures
}

function updatePageGeometry() {
    mesh.geometry.dispose();
    const geom = getPageGeometry(angle);
    mesh.geometry = geom;

    // Ensure the left and right meshes are updated as well
    leftside_mesh.geometry.dispose();
    leftside_mesh.geometry = getPageGeometry(187);

    rightside_mesh.geometry.dispose();
    rightside_mesh.geometry = getPageGeometry(-7);

    renderer.render(scene, camera); // Render the updated scene
}

updatePageGeometry();

function turnPageForward() {
    if (!animating && currentPage < (pageTextures.length / 2 - 1)) {
        animateTurnPage(187, function() {
            currentPage++;
            updatePageTexture(currentPage);
        });
    }
}

function turnPageBackward() {
    if (!animating && currentPage > 0) {
        animateTurnPage(-7, function() {
            currentPage--;
            updatePageTexture(currentPage);
        });
    }
}

function render(render_time) {
    if (animating === true) {
        if (start_time < 0) {
            start_time = render_time;
        }
        const new_time = render_time - start_time;
        const delta = new_time - animation_time;
        animation_time = new_time;

        angle = angle + (speed * delta);
        if (angle > 187) {
            angle = -7.0;
        }

        mesh.geometry.dispose();
        const geom = getPageGeometry(angle);
        mesh.geometry = geom;
    }
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}
