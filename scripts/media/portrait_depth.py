# Face-centred portrait crop + monocular depth for the homepage point cloud.
# usage (from repo root): python3 scripts/media/portrait_depth.py path/to/depth_anything_v2_vits.onnx
#   model: https://github.com/fabio-sim/Depth-Anything-ONNX/releases (v2.0.0)
#   needs: pip install numpy pillow onnxruntime
import sys
import numpy as np, onnxruntime as ort
from PIL import Image
im=Image.open('content/authors/admin/avatar.jpg')
x0,y0,s=1000,60,3300   # square crop (px in the 4300x6168 original) centred on the face
crop=im.crop((x0,y0,x0+s,y0+s))
crop.resize((800,800),Image.LANCZOS).save('content/authors/admin/portrait.jpg',quality=88,optimize=True,progressive=True)
sess=ort.InferenceSession(sys.argv[1],providers=['CPUExecutionProvider'])
i=sess.get_inputs()[0]; print(i.name,i.shape)
x=np.asarray(crop.resize((518,518),Image.BICUBIC),dtype=np.float32)/255.
x=(x-[0.485,0.456,0.406])/[0.229,0.224,0.225]
x=x.transpose(2,0,1)[None].astype(np.float32)
d=sess.run(None,{i.name:x})[0].squeeze()
print(d.shape,d.min(),d.max())
d=(d-d.min())/(d.max()-d.min())
Image.fromarray((d*255).astype(np.uint8)).resize((128,128),Image.LANCZOS).save('content/authors/admin/portrait-depth.png',optimize=True)
