import { string, z } from 'zod';

/**
 * Schema for user data
 * Defines the structure for user information
 */
export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  hashed_password: z.string(),
  is_active: z.boolean()
});

/**
 * Type from {@link UserSchema}
 * Represents the data structure for a user
 * @field id - unique identifier for the user
 * @field username - the username of the user
 * @field email - the email address of the user
 * @field hashed_password - the hashed password of the user
 * @field is_active - boolean indicating if the user is active
 */
export type UserData = z.infer<typeof UserSchema>

/**
 * Schema for login data
 * Defines the structure for login information
 */
export const LoginSchema = z.object({
  access_token: z.string(),
  token_type: z.string()
});

/**
 * Type from {@link LoginSchema}
 * Represents the data structure for login information
 * @field access_token - the access token provided on login
 * @field token_type - the type of token provided
 */
export type LoginData = z.infer<typeof LoginSchema>

/**
 * Schema for retrieving experiments
 * Defines an array of experiment names as strings
 */
export const getExperimentsSchema = z.object({
  experiments: z.array(string())
});

/**
 * Type from {@link getExperimentsSchema}
 * @field experiments - an array of experiment names
 */
export type getExperimentsData = z.infer<typeof getExperimentsSchema>

/**
 * Schema for results of adding experiments
 * Defines an array of experiment names as strings
 */
export const addExperimentSchema = z.object({
  experiments: z.array(string())
});

/**
 * Type from {@link addExperimentSchema}
 * @field experiments - an array of experiment names
 */
export type addExperimentData = z.infer<typeof addExperimentSchema>

/**
 * Schema for results of deleting experiments
 * Defines an array of experiment names as strings
 */
export const deleteExperimentSchema = z.object({
  experiments: z.array(string())
});

/**
 * Type from {@link deleteExperimentSchema}
 * @field experiments - an array of experiment names
 */
export type deleteExperimentData = z.infer<typeof deleteExperimentSchema>

/**
 * Schema for results of setting up an experiment
 * Defines a success flag as a boolean
 */
export const setUpExperimentSchema = z.object({
  success: z.boolean()
});

/**
 * Type from {@link setUpExperimentSchema}
 * @field success - a boolean indicating if the setup was successful
 */
export type setUpExperimentData = z.infer<typeof setUpExperimentSchema>

/**
 * Schema for uploading a sample
 * Defines a success flag as a boolean
 */
export const uploadSampleSchema = z.object({
  success: z.boolean()
});

/**
 * Type from {@link uploadSampleSchema}
 * @field success - a boolean indicating if upload was successful
 */
export type uploadSampleData = z.infer<typeof uploadSampleSchema>

/**
 * Schema for retrieving samples
 * Defines an array of sample names as strings
 */
export const getSamplesSchema = z.array(z.string());

/**
 * Type from {@link getSamplesSchema}
 */
export type getSamplesData = z.infer<typeof getSamplesSchema>

/**
 * Schema for retrieving a single sample
 * Defines a sample file as a string
 */
export const getSampleSchema = z.string()

/**
 * Type from {@link getSampleSchema}
 */
export type getSampleData = z.infer<typeof getSampleSchema>

/**
 * Schema for a single sample
 * Defines the structure for a sample
 */
export const SampleSchema = z.object({
  sampleId: z.string(),
  name: z.string(),
  assetPath: z.string(),
  rating: z.number()
});

/**
 * Type from {@link SampleSchema}
 * Represents a single sample
 */
export type SampleData = z.infer<typeof SampleSchema>;

/**
 * Schema for a list of samples
 * Defines an array of samples
 */
export const SamplesListSchema = z.object({
  samples: z.array(SampleSchema)
});

/**
 * Type from {@link SamplesListSchema}
 * Represents a list of samples
 */
export type SamplesListData = z.infer<typeof SamplesListSchema>;
