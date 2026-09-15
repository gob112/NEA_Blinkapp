import cv2
import dlib
from imutils import face_utils
from scipy.spatial import distance as dst
import time

# A class representing a simple hash table for storing timestamps and Inter-Blink Intervals (IBIs)
class hashTable():
    def __init__(self, size):
        # Initialize the hash table with a given size
        self.size = size
        # Create a list of empty lists (buckets) for hash table storage
        self.table = [[] for _ in range(size)]
        # Maintain the order of insertion for retrieval
        self.insert_order = []

    def hash_function(self, t):
        # Hash function to determine the index for storing a timestamp
        return int(t) % self.size

    def insert(self, timestamp, ibi):
        # Insert a timestamp and its corresponding IBI into the hash table
        index = self.hash_function(timestamp)
        self.table[index].append((timestamp, ibi))
        self.insert_order.append(timestamp)

    def get(self):
        # Retrieve the most recently inserted timestamp
        return self.insert_order[-1]

    def clear(self):
        # Clear the hash table by reinitializing the internal data structure
        self.table = [[] for _ in range(self.size)]

# A class for detecting blinks and calculating IBIs
class Get_ibi:
    def __init__(self):
        # Initialize the hash table and parameters for blink detection
        self.Time = hashTable(100)
        self.blink_threshold = 0.5  # Threshold for Eye Aspect Ratio (EAR) to detect blinks
        self.min_frame = 1          # Minimum frame count to consider a blink
        self.max_frame = 10         # Maximum frame count to consider a blink
        self.blinks = 0             # Counter for the number of detected blinks

    def EAR(self, eye):
        # Calculate the Eye Aspect Ratio (EAR) for a given eye
        vertical1 = dst.euclidean(eye[1], eye[5])
        vertical2 = dst.euclidean(eye[2], eye[4])
        horizontal = dst.euclidean(eye[0], eye[3])

        ear = (vertical1 + vertical2) / horizontal
        return ear

    def get_blinks(self, fileName):
        # Process a video file to detect blinks and compute IBIs
        self.video = f"/Users/tanishasolanki/Desktop/schoolboy/NEA/dry_eyes_app/backend-python/uploads/{fileName}"

        # Open the video file using OpenCV
        self.cam = cv2.VideoCapture(self.video)

        # Initialize the face detector and landmark predictor
        self.detector = dlib.get_frontal_face_detector()
        self.landmark_model = dlib.shape_predictor("./shape_predictor_68_face_landmarks.dat")

        # Define the landmarks for the left and right eyes
        (self.left_start, self.left_end) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
        (self.right_start, self.right_end) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]

        count = 0  # Frame counter for detecting blinks
        while True:
            # Read a frame from the video
            _, frame = self.cam.read()
            if not _:
                break  # Exit if no more frames are available

            # Convert the frame to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            # Detect faces in the frame
            faces = self.detector(gray)
            for face in faces:
                x1 = face.left()
                y1 = face.top()
                x2 = face.right()
                y2 = face.bottom()
                # Draw a rectangle around the detected face
                cv2.rectangle(frame, (x1, y1), (x2, y2), 200, 2)

                # Get facial landmarks
                shapes = self.landmark_model(gray, face)
                shape = face_utils.shape_to_np(shapes)

                # Extract the landmarks for the left and right eyes
                left = shape[self.left_start:self.left_end]
                right = shape[self.right_start:self.right_end]

                # Calculate EAR for both eyes
                left_ear = self.EAR(left)
                right_ear = self.EAR(right)
                avg_ear = (left_ear + right_ear) / 2  # avarage of both eyes

                # Check if EAR indicates a blink ie bellow the blink threshold
                if avg_ear < self.blink_threshold:
                    count += 1
                else:
                    if count >= self.min_frame and count < self.max_frame:
                        self.blinks += 1  # Increment blink count by 1
                        count = 0
                        if len(self.Time.insert_order) == 0:
                            timestamp = time.time()  # Get the current timestamp
                            self.Time.insert(timestamp, 0)
                        else:
                            timestamp = time.time() 
                            ibi = timestamp - self.Time.get()  # Calculate IBI
                            self.Time.insert(timestamp, ibi)

            # Exit if 'q' key is pressed
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

        # Release the video capture object
        self.cam.release()
        
        final = self.Time.table  # Get the hash table containing all timestamps and IBIs
        print(final)
        return final  # Return the hash table data
