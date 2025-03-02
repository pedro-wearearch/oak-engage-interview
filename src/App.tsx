import { z } from "zod";
import { Input } from "./components/input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./App.module.css";
import { Select } from "./components/select";

const schema = z.object({
  personal: z.object({
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    address: z.string().nonempty("Address is required"),
  }),
  employer: z.array(
    z.object({
      employerName: z.string().nonempty("Employer name is required"),
      startDate: z.string(),
      endDate: z.string(),
    })
  ),
  guarantor: z.object({
    guarantorName: z.string().nonempty("Guarantor name is required"),
    guarantorAddress: z.string().nonempty("Guarantor address is required"),
    relationship: z.string(),
  }),
});

export type Schema = z.infer<typeof schema>;

function App() {
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      personal: {
        firstName: "",
        lastName: "",
        address: "",
      },
      employer: [
        {
          employerName: "",
          startDate: "",
          endDate: "",
        },
      ],
      guarantor: {
        guarantorName: "",
        guarantorAddress: "",
        relationship: "sibling",
      },
    },
  });

  const onSubmit = async (data: Schema) => {
    const formattedData = {
      personal: {
        first_name: data.personal.firstName,
        last_name: data.personal.lastName,
        current_address: data.personal.address,
      },
      employer: data.employer.map((emp) => ({
        name: emp.employerName,
        start_date: emp.startDate,
        end_date: emp.endDate,
      })),
      guarantor: {
        name: data.guarantor.guarantorName,
        address: data.guarantor.guarantorAddress,
        relationship: data.guarantor.relationship,
      },
    };

    try {
      const response = await fetch(
        "https://ref-api.goodlord.co/reference/new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
          mode: "no-cors",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error: ${response.status} - ${errorMessage}`);
      }

      alert("Form submitted successfully");
    } catch {
      alert("Failed to submit form");
    }
  };

  const { fields } = useFieldArray({
    control,
    name: "employer",
  });

  return (
    <section>
      <h1>Goodlord Referencing form</h1>

      <form role="form" onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <legend>Personal</legend>

          <Input<Schema>
            name="personal.firstName"
            label={"First Name"}
            error={errors}
            onChange={(e) => setValue("personal.firstName", e.target.value)}
          />

          <Input<Schema>
            name="personal.lastName"
            label={"Last Name"}
            error={errors}
            onChange={(e) => setValue("personal.lastName", e.target.value)}
          />

          <Input<Schema>
            name="personal.address"
            label={"Address"}
            error={errors}
            onChange={(e) => setValue("personal.address", e.target.value)}
          />
        </fieldset>

        <fieldset>
          <legend>Employer</legend>

          {fields.map((field, number) => (
            <div key={field.id} className={styles.employerContainer}>
              <Input<Schema>
                name={`employer.${number}.employerName`}
                label={"Employer Name"}
                error={errors}
                onChange={(e) =>
                  setValue(`employer.${number}.employerName`, e.target.value)
                }
              />

              <div className={styles.row}>
                <Input<Schema>
                  name={`employer.${number}.startDate`}
                  label={"Start date"}
                  error={errors}
                  onChange={(e) =>
                    setValue(`employer.${number}.startDate`, e.target.value)
                  }
                />

                <Input<Schema>
                  name={`employer.${number}.endDate`}
                  label={"End date"}
                  error={errors}
                  onChange={(e) =>
                    setValue(`employer.${number}.endDate`, e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </fieldset>

        <fieldset>
          <legend>Guarantor</legend>

          <Input<Schema>
            name="guarantor.guarantorName"
            label={"Guarantor Name"}
            error={errors}
            onChange={(e) =>
              setValue("guarantor.guarantorName", e.target.value)
            }
          />

          <Input<Schema>
            name="guarantor.guarantorAddress"
            label={"Guarantor Address"}
            error={errors}
            onChange={(e) =>
              setValue("guarantor.guarantorAddress", e.target.value)
            }
          />

          <Select
            name="guarantor.relationship"
            label={"Relationship to guarantor"}
            options={[
              { value: "parent", label: "Parent" },
              { value: "sibling", label: "Sibling" },
              { value: "employer", label: "Employer" },
              { value: "other", label: "Other" },
            ]}
            onChange={(e) => setValue("guarantor.relationship", e.target.value)}
          />
        </fieldset>

        <div className={styles.formButtonContainer}>
          <a href="">Cancel</a>
          <button type="submit">Submit</button>
        </div>
      </form>
    </section>
  );
}

export default App;
